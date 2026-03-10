import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt, eventType } = await req.json();

        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 600,
            messages: [
                {
                    role: 'system',
                    content: `Eres un disenador especializado en invitaciones elegantes para eventos sociales en Mexico. Genera un tema visual completo basado en la descripcion del usuario. Responde UNICAMENTE con JSON valido, sin markdown ni texto extra:
{
  "theme_name": "string",
  "colors": { "primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex" },
  "fonts": { "heading": "nombre Google Font", "body": "nombre Google Font" },
  "decorations": ["elemento1", "elemento2", "elemento3"],
  "mood": "descripcion breve"
}
Reglas: colores en hexadecimal, fuentes de Google Fonts, colores armonicos para el tipo de evento (boda=elegante, xv=romantico, bautizo=suave, babyshower=jugueton, comunion=sagrado).`,
                },
                {
                    role: 'user',
                    content: `Tipo de evento: ${eventType}. Descripcion: ${prompt}`,
                },
            ],
        });

        const text = completion.choices[0].message.content || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');

        const theme = JSON.parse(jsonMatch[0]);
        return NextResponse.json(theme);
    } catch (err) {
        console.error('AI theme error:', err);
        return NextResponse.json({ error: 'Error generando tema' }, { status: 500 });
    }
}
