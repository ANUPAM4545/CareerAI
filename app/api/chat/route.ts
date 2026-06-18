import { getInterviewerStream, getEnglishCoachStream } from '@/lib/ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, mode, targetRole } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    let result;

    if (mode === 'interview') {
      result = await getInterviewerStream(messages, targetRole || 'Software Engineer');
    } else if (mode === 'english_coach') {
      result = await getEnglishCoachStream(messages);
    } else {
      return new Response('Invalid mode', { status: 400 });
    }

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('An error occurred during chat generation', { status: 500 });
  }
}
