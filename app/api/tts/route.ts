import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, gender } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'TTS API Key not configured' }, { status: 500 });
    }

    // Google Cloud TTS API endpoint
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    // Select Voice
    // We want premium Wavenet Indian voices
    // en-IN-Wavenet-A (Female)
    // en-IN-Wavenet-B (Male)
    // en-IN-Wavenet-C (Male)
    // en-IN-Wavenet-D (Female)
    
    let voiceName = 'en-IN-Wavenet-A'; // Default to Female
    if (gender === 'male') {
      voiceName = 'en-IN-Wavenet-C'; // Wavenet-C is a deep male voice
    }
    
    console.log(`TTS Request: gender=${gender}, Selected Voice=${voiceName}`);

    const payload = {
      input: { text },
      voice: {
        languageCode: 'en-IN',
        name: voiceName,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google TTS Error:", errorText);
      return NextResponse.json({ error: 'Failed to generate speech', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    
    // Google returns audioContent as a base64 encoded string
    return NextResponse.json({ audioContent: data.audioContent });

  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
