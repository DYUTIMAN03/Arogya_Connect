import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServerClient();

    // 1. Check if patient exists or create new
    let patientId = body.patientId;
    let patientRecord;

    if (!patientId && body.phone) {
      // Upsert patient based on phone
      const { data: patient, error: pError } = await supabase
        .from('patients')
        .upsert({
          phone: body.phone,
          full_name: body.full_name,
          age: body.age,
          gender: body.gender,
          village: body.village,
          known_conditions: body.known_conditions || [],
          allergies: body.allergies || [],
        }, { onConflict: 'phone' })
        .select()
        .single();
        
      if (pError) throw pError;
      patientId = patient.id;
      patientRecord = patient;
    }

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID or Phone required' }, { status: 400 });
    }

    // 2. Create Visit Record
    const clinicId = process.env.NEXT_PUBLIC_CLINIC_ID || '00000000-0000-0000-0000-000000000001';

    const { data: visit, error: vError } = await supabase
      .from('visits')
      .insert({
        patient_id: patientId,
        clinic_id: clinicId,
        status: 'registered'
      })
      .select()
      .single();

    if (vError) throw vError;

    return NextResponse.json({ success: true, visitId: visit.id, patientId });

  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
