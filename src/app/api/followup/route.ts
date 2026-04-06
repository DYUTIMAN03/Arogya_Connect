import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { visitId, type, response } = await request.json();
    const supabase = createServerClient();

    // Just logging to followups table for Demo purposes
    const { error } = await supabase.from('followups').insert({
      visit_id: visitId,
      type: type || 'checkin',
      response: response || null,
      escalated: response === '3', // 3 = Worse
      sent_at: new Date().toISOString()
    });

    if (error) throw error;

    return NextResponse.json({ success: true, escalated: response === '3' });
  } catch (error: any) {
    console.error('Followup Engine Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
