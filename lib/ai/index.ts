import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { getInterviewerPrompt, getCoachPrompt, getSandboxPrompt, ANALYSIS_SYSTEM_PROMPT } from './prompts';

const DEFAULT_MODEL = google('gemini-2.5-flash');

const INTERVIEWER_PERSONAS: Record<string, {name: string, role: string}> = {
  // Tech
  "swe-manager": { name: "Ravi", role: "Senior Engineering Manager" },
  "intern-recruiter": { name: "Riya", role: "University Technical Recruiter" },
  "system-design": { name: "Vikram", role: "Principal Software Architect" },
  "product-manager": { name: "Sarah", role: "VP of Product Management" },
  "data-scientist": { name: "Dr. Chen", role: "Lead Data Scientist" },
  "cyber": { name: "Aisha", role: "Chief Information Security Officer" },
  // Government
  "upsc-board": { name: "Mr. Sharma", role: "UPSC Board Chairman" },
  "psu-board": { name: "Mrs. Gupta", role: "Public Sector Technical Director" },
  // Business
  "consultant": { name: "Arthur", role: "Senior Partner at McKinsey" },
  "banker": { name: "Eleanor", role: "Managing Director of Investment Banking" },
  "sales": { name: "Marcus", role: "VP of Global Enterprise Sales" },
  // Healthcare
  "medical-board": { name: "Dr. Patel", role: "Chief of Surgery & Residency Director" },
  "nursing-board": { name: "Nurse Jenkins", role: "Head of Patient Care Operations" },
  // Behavioral
  "hr-behavioral": { name: "Chloe", role: "Global Head of Talent Acquisition" },
};

const COACH_PERSONAS: Record<string, {name: string, role: string}> = {
  "negotiation": { name: "Dev", role: "Executive Salary Negotiation Coach" },
  "workplace": { name: "Tara", role: "Corporate Communication Specialist" },
};

export const getInterviewerStream = async (messages: any[], targetRole: string, topic?: string, experienceLevel?: string, personaId?: string, roundContext?: string, questionCount: number = 5, scenarioSeed: string = "none") => {
  const persona = (personaId && INTERVIEWER_PERSONAS[personaId]) || { name: "Ravi", role: "Senior Hiring Manager" };
  const basePrompt = getInterviewerPrompt(persona.name, persona.role, questionCount, scenarioSeed);

  const topicInstruction = roundContext 
    ? `\n\nCRITICAL INSTRUCTION: The user is in a specific interview round: ${roundContext}. Tailor your questions strictly to this round's requirements.` 
    : '';

  const expInstruction = experienceLevel
    ? `\n\nThe candidate's experience level is: ${experienceLevel}. Calibrate your questions, expectations, and scrutiny to match this specific level.`
    : '';

  return streamText({
    model: DEFAULT_MODEL,
    system: `${basePrompt}\n\nThe user is applying for the role of: ${targetRole}${topicInstruction}${expInstruction}`,
    messages,
    temperature: 0.7,
  });
};

export const getEnglishCoachStream = async (messages: any[], topic?: string) => {
  const persona = (topic && COACH_PERSONAS[topic]) || { name: "Priya", role: "Executive Communication Coach" };
  const basePrompt = getCoachPrompt(persona.name, persona.role);

  const topicInstruction = topic && topic !== 'General' 
    ? `\n\nCRITICAL INSTRUCTION: The user has specifically requested to focus this conversation heavily on: ${topic.toUpperCase().replace('-', ' ')}. Steer the roleplay strictly to this domain.` 
    : '';

  return streamText({
    model: DEFAULT_MODEL,
    system: `${basePrompt}${topicInstruction}`,
    messages,
    temperature: 0.7,
  });
};

export async function getSandboxStream(messages: any[], skillId: string) {
  return streamText({
    model: DEFAULT_MODEL,
    system: getSandboxPrompt(skillId),
    messages,
  });
}

export const generateFeedbackAnalysis = async (question: string, answer: string) => {
  const { text } = await generateText({
    model: DEFAULT_MODEL,
    system: ANALYSIS_SYSTEM_PROMPT,
    prompt: `Analyze the following response.\n\nQuestion asked: "${question}"\nUser's Answer: "${answer}"\n\nReturn ONLY JSON matching this schema exactly (do not wrap in markdown blocks, just raw JSON): { "fluency": number, "grammar": number, "confidence": number, "technical": number, "feedback": "string", "improvements": ["string"] }`,
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
