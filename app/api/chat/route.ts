import { getInterviewerStream, getEnglishCoachStream } from '@/lib/ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const queryMode = url.searchParams.get('mode');
    const queryTargetRole = url.searchParams.get('targetRole');

    const body = await req.json();
    console.log('[API CHAT] Received body:', JSON.stringify(body, null, 2));
    
    // Attempt to read from the referer if params were missed
    const referer = req.headers.get('referer');
    let refererMode = null;
    if (referer) {
       if (referer.includes('english_coach')) refererMode = 'english_coach';
       else if (referer.includes('interview')) refererMode = 'interview';
    }

    // Fallback to query params if the SDK drops the body payload
    const messages = body.messages;
    const mode = body.mode || queryMode || refererMode;
    const targetRole = body.targetRole || queryTargetRole || 'Software Engineer';
    const experienceLevel = body.experienceLevel || 'Mid-Level';
    const topic = body.topic || null;
    const personaId = body.personaId || null;
    const roundContext = body.roundContext || null;
    const questionCount = body.questionCount || 5;
    const scenarioSeed = body.scenarioSeed || "none";

    if (!messages || messages.length === 0) {
      console.log('[API CHAT] Missing messages');
      return new Response('Messages are required', { status: 400 });
    }

    if (!mode) {
      console.log('[API CHAT] Missing mode');
      return new Response('Invalid mode', { status: 400 });
    }

    let result;

    if (mode === 'english_coach') {
       result = await getEnglishCoachStream(messages, topic);
    } else {
       result = await getInterviewerStream(messages, targetRole, topic, experienceLevel, personaId, roundContext, questionCount, scenarioSeed);
    }
    // The newest AI SDK uses toUIMessageStreamResponse instead of toDataStreamResponse
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('An error occurred during chat generation', { status: 500 });
  }
}
