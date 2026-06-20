import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/ai/prompts";

const DEFAULT_MODEL = google('gemini-2.5-flash');

const EvaluationSchema = z.object({
  fluencyScore: z.number().min(0).max(100),
  grammarScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  overallFeedback: z.string(),
  corrections: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  recommendedResources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    description: z.string(),
    reason: z.string()
  })).optional(),
});

export async function POST(req: Request) {
  try {
    const { sessionId, cheatDetected } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if session belongs to user
    const { data: session } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userData.user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Fetch messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true });

    if (!cheatDetected && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: "No messages in session" }, { status: 400 });
    }

    // Format transcript for AI
    const transcriptText = messages
      .map((m) => `${m.sender.toUpperCase()}: ${m.transcript}`)
      .join("\n");

    const promptText = `
Here is the transcript of the session. Please evaluate the user's performance.

<transcript>
${transcriptText}
</transcript>
    `;

    // Call Gemini 2.5 Flash to generate evaluation, UNLESS cheating was detected
    let object;
    if (cheatDetected) {
      object = {
        fluencyScore: 0,
        grammarScore: 0,
        confidenceScore: 0,
        technicalScore: 0,
        overallFeedback: "CRITICAL VIOLATION: The session was forcefully terminated due to a breach of academic integrity (repeatedly switching tabs or leaving the proctored environment). Your score is a 0.",
        corrections: ["Maintain focus on the interview tab.", "Do not use external resources."],
        strengths: ["None. Integrity violation detected."],
        recommendedResources: []
      };
    } else {
      const result = await generateObject({
        model: DEFAULT_MODEL,
        system: ANALYSIS_SYSTEM_PROMPT,
        prompt: promptText,
        schema: EvaluationSchema,
      });
      object = result.object;
    }

    // Save evaluation to DB
    const { error: evalError } = await supabase
      .from("evaluations")
      .insert({
        session_id: sessionId,
        evaluation_json: object,
      });

    if (evalError) {
      console.error("Error saving evaluation:", evalError);
      return NextResponse.json({ error: "Failed to save evaluation" }, { status: 500 });
    }

    return NextResponse.json({ success: true, evaluation: object });

  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
