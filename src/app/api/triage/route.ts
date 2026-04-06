import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import Groq from 'groq-sdk';
import { HARD_OVERRIDE_RULES, GROQ_SYSTEM_PROMPT } from '@/lib/prompt-engineering';
import { TriageInput, TriageResult } from '@/lib/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { visitId, triageData } = await request.json() as { visitId: string, triageData: TriageInput };
    const supabase = createServerClient();

    // ---------------------------------------------------------
    // STAGE 1: HARD OVERRIDE CAPTURE
    // ---------------------------------------------------------
    let forcedOverride = null;
    const complaintLower = triageData.chief_complaint.toLowerCase();

    for (const rule of HARD_OVERRIDE_RULES) {
      if (complaintLower.includes(rule.trigger)) {
        forcedOverride = rule;
        break;
      }
    }

    if (// Check infant fever
        triageData.age <= 2 && 
        triageData.temp && 
        parseFloat(triageData.temp) >= 104) {
      forcedOverride = { priority: 'P1', rule: 'Infant fever > 104°F' };
    }
    
    if (// Check severe oxygen drop
        triageData.spo2 && 
        parseFloat(triageData.spo2) < 90) {
      forcedOverride = { priority: 'P1', rule: 'SpO2 < 90%' };
    }

    let finalTriage: TriageResult;

    if (forcedOverride) {
      console.log('💥 HARD OVERRIDE TRIGGERED:', forcedOverride.rule);
      finalTriage = {
        priority: forcedOverride.priority as any,
        confidence: 1.0,
        reasoning: `AUTOMATIC OVERRIDE REGISTRATION: System detected critical condition matching safety rule - ${forcedOverride.rule}`,
        hard_override_triggered: true,
        override_rule: forcedOverride.rule,
        flags: ['CRITICAL', forcedOverride.rule],
        recommend_vitals: ['BP', 'SpO2', 'Heart Rate'],
        review_required: false
      };
    } else {
      // ---------------------------------------------------------
      // STAGE 2: GROQ LLAMA-3.3-70B INFERENCE
      // ---------------------------------------------------------
      const prompt = `
      Patient: Age ${triageData.age}, Gender ${triageData.gender}
      Known conditions: ${triageData.known_conditions.join(', ') || 'None'}
      Current medications: ${triageData.current_meds.join(', ') || 'None'} | Allergies: ${triageData.allergies.join(', ') || 'None'}
      Chief complaint: ${triageData.chief_complaint} | Duration: ${triageData.duration}
      Severity (self-rated 1-10): ${triageData.severity}
      Associated symptoms: ${triageData.associated_symptoms?.join(', ') || 'None'}
      Mobility: ${triageData.mobility}
      Vitals: BP=${triageData.bp || 'Unknown'}, Temp=${triageData.temp || 'Unknown'}, SpO2=${triageData.spo2 || 'Unknown'}
      
      Classify this patient.`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: GROQ_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        temperature: 0.2, // Low temp for more deterministic classification
      });

      const responseContent = response.choices[0]?.message?.content || '{}';
      finalTriage = JSON.parse(responseContent);
      finalTriage.hard_override_triggered = false;
      finalTriage.review_required = false;

      // ---------------------------------------------------------
      // STAGE 3: CONFIDENCE THRESHOLD ENFORCEMENT
      // ---------------------------------------------------------
      if (finalTriage.confidence < 0.70 && finalTriage.priority === 'P3') {
        console.log('⚠️ CONFIDENCE ESCALATION: P3 -> P2');
        finalTriage.priority = 'P2';
        finalTriage.reasoning += ' [AUTO-ESCALATED: System detected low confidence in assessment]';
        finalTriage.review_required = true;
      }
    }

    // ---------------------------------------------------------
    // DB PERSISTENCE
    // ---------------------------------------------------------

    // 1. Save triage record
    const { error: tError } = await supabase.from('triage_records').insert({
      visit_id: visitId,
      raw_inputs: triageData as any,
      priority: finalTriage.priority,
      confidence: finalTriage.confidence,
      reasoning: finalTriage.reasoning,
      hard_override_triggered: finalTriage.hard_override_triggered,
      override_rule: finalTriage.override_rule,
      flags: finalTriage.flags,
      recommend_vitals: finalTriage.recommend_vitals,
      review_required: finalTriage.review_required
    });
    
    if (tError) throw tError;

    // 2. Queue placement logic
    const clinicId = process.env.NEXT_PUBLIC_CLINIC_ID || '00000000-0000-0000-0000-000000000001';
    
    // Get current queue to determine position
    const { data: queue } = await supabase
      .from('queue_entries')
      .select('priority, position')
      .eq('clinic_id', clinicId)
      .eq('status', 'waiting')
      .order('position', { ascending: true });

    let newPosition = 1;
    if (queue && queue.length > 0) {
      if (finalTriage.priority === 'P1') {
        // Find last P1, put right after it. P1s cut the line entirely.
        const lastP1 = queue.filter(q => q.priority === 'P1').pop();
        newPosition = lastP1 ? lastP1.position + 1 : 1;
      } else if (finalTriage.priority === 'P2') {
        const lastP2 = queue.filter(q => q.priority === 'P2' || q.priority === 'P1').pop();
        newPosition = lastP2 ? lastP2.position + 1 : 1;
      } else {
        // P3 goes to end of waiting
        newPosition = queue[queue.length - 1].position + 1;
      }
    }

    // Insert Queue Record
    const { error: qError } = await supabase.from('queue_entries').insert({
      visit_id: visitId,
      clinic_id: clinicId,
      priority: finalTriage.priority,
      position: newPosition,
      status: 'waiting'
    });

    if (qError) throw qError;

    // 3. Update visit status
    await supabase.from('visits').update({ status: 'in_queue' }).eq('id', visitId);

    // Fire off SOAP generation async to not block client response
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/soap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitId, triageData, triageResult: finalTriage })
    }).catch(e => console.error('SOAP kick-off failed:', e));

    return NextResponse.json({ success: true, triage: finalTriage, queuePosition: newPosition });

  } catch (error: any) {
    console.error('Triage Engine Error:', error);
    return NextResponse.json({ error: error.message || 'Triage failed' }, { status: 500 });
  }
}
