import { generateFeedbackAnalysis } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const analysis = await generateFeedbackAnalysis(question, answer);

    if (!analysis) {
      return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analyze API Error:', error);
    return NextResponse.json({ error: 'An error occurred during analysis' }, { status: 500 });
  }
}
