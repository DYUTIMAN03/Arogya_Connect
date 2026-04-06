import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import Groq from 'groq-sdk';
import { GROQ_SOAP_SYSTEM_PROMPT } from '@/lib/prompt-engineering';
import { TriageInput, TriageResult } from '@/lib/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { visitId, triageData, triageResult } = await request.json() as { 
      visitId: string; 
      triageData: TriageInput; 
      triageResult: TriageResult;
    };
    
    const supabase = createServerClient();

    const prompt = `
      Create a SOAP brief based on this triage:
      Reported: ${triageData.chief_complaint} for ${triageData.duration}. Severity: ${triageData.severity}/10.
      Vitals: BP ${triageData.bp}, Temp ${triageData.temp}, SpO2 ${triageData.spo2}.
      AI Assessment Priority: ${triageResult.priority}. Flags: ${triageResult.flags.join(', ')}
      Reasoning: ${triageResult.reasoning}
    `;

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: GROQ_SOAP_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const soapBrief = JSON.parse(response.choices[0]?.message?.content || '{}');

    // Pre-create the consultation record with the AI-generated SOAP
    const { error } = await supabase.from('consultations').insert({
      visit_id: visitId,
      soap_brief: soapBrief,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SOAP Engine Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
