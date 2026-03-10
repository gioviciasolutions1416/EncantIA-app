import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt, eventType } = await req.json();

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 300,
            messages: [
                {
                    role: 'system',
                    content: 'Eres un diseñador experto en invitaciones de eventos. Responde SOLO con JSON válido, sin texto adicional.',
                },
                {
                    role: 'user',
                    content: `Genera un tema visual para una invitación de tipo "${eventType}".
Descripción: "${prompt}"

Responde SOLO con este JSON exacto:
{
  "primary": "#hexcolor",
  "secondary": "#hexcolor",
  "accent": "#hexcolor",
  "background": "#hexcolor",
  "text": "#hexcolor",
  "font": "nombre de fuente Google Fonts",
  "style": "descripción máx 5 palabras"
}`,
                },
            ],
        });

        const text = completion.choices[0].message.content || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON');

        const theme = JSON.parse(jsonMatch[0]);
        return NextResponse.json(theme);
    } catch {
        const defaults: Record<string, object> = {
            'Boda': { primary: '#a35d6a', secondary: '#7B2D8B', accent: '#e8c49a', background: '#fdf8f0', text: '#2d1b2d', font: 'Playfair Display', style: 'Elegante y romántico' },
            'XV Años': { primary: '#9b59b6', secondary: '#e91e8c', accent: '#f1c40f', background: '#fdf0ff', text: '#2d1b3d', font: 'Cormorant Garamond', style: 'Festivo y glamuroso' },
            'Bautizo': { primary: '#5dade2', secondary: '#85c1e9', accent: '#f9e79f', background: '#f0f8ff', text: '#1a3a4a', font: 'Lato', style: 'Tierno y celestial' },
            'Baby Shower': { primary: '#f48fb1', secondary: '#ce93d8', accent: '#fff59d', background: '#fff8fc', text: '#3d1a2d', font: 'Nunito', style: 'Dulce y pastel' },
            'Comunión': { primary: '#c8976a', secondary: '#a35d6a', accent: '#f5e6d3', background: '#fffdf8', text: '#2d1b2d', font: 'EB Garamond', style: 'Sagrado y tradicional' },
        };
        return NextResponse.json(defaults[eventType as string] || defaults['Boda']);
    }
}
