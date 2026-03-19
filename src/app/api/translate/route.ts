import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY no encontrada en variables de entorno');
      return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });
    }

    const { fields, event_type } = await req.json();

    const prompt = `You are a professional translator specializing in elegant wedding and social event invitations in Mexico. 
Translate the following fields from Spanish to English. Keep the tone elegant, warm and romantic.
For itinerary_items and padrinos_list, translate only the text fields (titulo, descripcion, rol, nombre) keeping the same JSON structure.
Return ONLY a valid JSON object with the same keys, no explanation, no markdown, no backticks.

Event type: ${event_type}

Fields to translate:
${JSON.stringify(fields, null, 2)}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator for elegant social event invitations. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ OpenAI error:', JSON.stringify(data));
      return NextResponse.json({ 
        error: 'Translation failed', 
        details: data.error?.message || JSON.stringify(data)
      }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const translated = JSON.parse(clean);

    return NextResponse.json(translated);

  } catch (err) {
    console.error('❌ Translation error:', err);
    return NextResponse.json({ 
      error: 'Internal error', 
      details: String(err) 
    }, { status: 500 });
  }
}
