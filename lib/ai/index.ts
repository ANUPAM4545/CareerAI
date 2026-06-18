import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { INTERVIEWER_PROMPT, ENGLISH_COACH_PROMPT, ANALYSIS_SYSTEM_PROMPT } from './prompts';

// We use Gemini 1.5 Flash because it's incredibly fast, highly capable, and has a very generous FREE tier.
const DEFAULT_MODEL = google('models/gemini-1.5-flash-latest');

export const getInterviewerStream = async (messages: any[], targetRole: string) => {
  return streamText({
    model: DEFAULT_MODEL,
    system: \`\${INTERVIEWER_PROMPT}\\n\\nThe user is applying for the role of: \${targetRole}\`,
    messages,
    temperature: 0.7,
  });
};

export const getEnglishCoachStream = async (messages: any[]) => {
  return streamText({
    model: DEFAULT_MODEL,
    system: ENGLISH_COACH_PROMPT,
    messages,
    temperature: 0.7,
  });
};

export const generateFeedbackAnalysis = async (question: string, answer: string) => {
  const { text } = await generateText({
    model: DEFAULT_MODEL,
    system: ANALYSIS_SYSTEM_PROMPT,
    prompt: \`Analyze the following response.\\n\\nQuestion asked: "\${question}"\\nUser's Answer: "\${answer}"\\n\\nReturn ONLY JSON matching this schema exactly (do not wrap in markdown blocks, just raw JSON): { "fluency": number, "grammar": number, "confidence": number, "technical": number, "feedback": "string", "improvements": ["string"] }\`,
    temperature: 0.1,
  });

  try {
    // Attempt to clean the text in case Gemini wraps it in ```json ... ```
    const cleanText = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse analysis JSON", e, "Raw output:", text);
    return null;
  }
};
