export type Role = 'patient' | 'asha' | 'coordinator' | 'doctor' | 'admin';
export type Priority = 'P1' | 'P2' | 'P3';
export type VisitStatus = 'registered' | 'triaged' | 'in_queue' | 'in_consult' | 'completed' | 'referred';
export type QueueStatus = 'waiting' | 'called' | 'in_consult' | 'no_show' | 'done';

export interface Patient {
  id: string;
  phone: string;
  full_name: string;
  dob?: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  village?: string;
  district?: string;
  abha_id?: string;
  known_conditions: string[];
  allergies: string[];
  current_meds: string[];
  preferred_language: string;
  created_at: string;
}

export interface Visit {
  id: string;
  patient_id: string;
  clinic_id: string;
  asha_id?: string;
  status: VisitStatus;
  created_at: string;
  completed_at?: string;
  patient?: Patient;
}

export interface TriageRecord {
  id: string;
  visit_id: string;
  raw_inputs: Record<string, unknown>;
  priority: Priority;
  confidence: number;
  reasoning: string;
  hard_override_triggered: boolean;
  override_rule?: string;
  flags: string[];
  recommend_vitals: string[];
  review_required: boolean;
  human_reviewed: boolean;
  reviewed_by?: string;
  review_note?: string;
  created_at: string;
}

export interface QueueEntry {
  id: string;
  visit_id: string;
  clinic_id: string;
  priority: Priority;
  position: number;
  joined_at: string;
  called_at?: string;
  status: QueueStatus;
  visit?: Visit & { patient?: Patient; triage_records?: TriageRecord[] };
}

export interface SOAPBrief {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface Consultation {
  id: string;
  visit_id: string;
  doctor_id?: string;
  soap_brief?: SOAPBrief;
  notes?: string;
  diagnosis?: string;
  refer_to?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
}

export interface Medication {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  consultation_id: string;
  medications: Medication[];
  pdf_url?: string;
  sent_via: string[];
  sent_at?: string;
  created_at: string;
}

export interface Staff {
  id: string;
  clinic_id: string;
  role: 'doctor' | 'coordinator' | 'asha' | 'admin';
  name: string;
  phone: string;
  is_online: boolean;
  created_at: string;
}

export interface TriageInput {
  // Patient
  age: number;
  gender: string;
  known_conditions: string[];
  allergies: string[];
  current_meds: string[];
  // Symptoms
  chief_complaint: string;
  duration: string;
  severity: number; // 1-10
  associated_symptoms: string[];
  mobility: 'ambulatory' | 'assisted' | 'bedridden';
  // Vitals
  bp?: string;
  temp?: string;
  spo2?: string;
}

export interface TriageResult {
  priority: Priority;
  confidence: number;
  reasoning: string;
  hard_override_triggered: boolean;
  override_rule?: string;
  flags: string[];
  recommend_vitals: string[];
  review_required: boolean;
}

// Demo session type for role switching
export interface DemoSession {
  role: Role;
  staffId?: string;
  staffName?: string;
  patientId?: string;
  patientName?: string;
  visitId?: string;
}
