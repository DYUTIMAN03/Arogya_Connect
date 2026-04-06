-- ============================================================
-- ArogyaConnect — Supabase Schema
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CLINICS
-- ============================================================
CREATE TABLE IF NOT EXISTS clinics (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  district    text,
  state       text,
  phone       text,
  coordinates point,
  timezone    text DEFAULT 'Asia/Kolkata',
  created_at  timestamptz DEFAULT now()
);

-- Insert a default demo clinic
INSERT INTO clinics (id, name, district, state, phone)
VALUES ('00000000-0000-0000-0000-000000000001', 'Rampur PHC', 'Bareilly', 'Uttar Pradesh', '+919999999999')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. STAFF (Doctors, Coordinators, ASHA Workers)
-- ============================================================
CREATE TABLE IF NOT EXISTS staff (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id   uuid REFERENCES clinics(id),
  role        text NOT NULL CHECK (role IN ('doctor', 'coordinator', 'asha', 'admin')),
  name        text NOT NULL,
  phone       text UNIQUE NOT NULL,
  is_online   boolean DEFAULT false,
  pin_hash    text,
  created_at  timestamptz DEFAULT now()
);

-- Demo staff
INSERT INTO staff (id, clinic_id, role, name, phone) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'doctor', 'Dr. Priya Sharma', '+911111111111'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'coordinator', 'Anita Singh', '+912222222222'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'asha', 'Kavita Devi', '+913333333333')
ON CONFLICT (phone) DO NOTHING;

-- ============================================================
-- 3. PATIENTS (master record — persists across all visits)
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
  id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone              text UNIQUE NOT NULL,
  full_name          text NOT NULL,
  dob                date,
  age                int,
  gender             text CHECK (gender IN ('male', 'female', 'other')),
  village            text,
  district           text,
  abha_id            text,
  known_conditions   text[] DEFAULT '{}',
  allergies          text[] DEFAULT '{}',
  current_meds       text[] DEFAULT '{}',
  preferred_language text DEFAULT 'hi',
  created_at         timestamptz DEFAULT now()
);

-- ============================================================
-- 4. VISITS (one per clinic session)
-- ============================================================
CREATE TABLE IF NOT EXISTS visits (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id   uuid REFERENCES patients(id) NOT NULL,
  clinic_id    uuid REFERENCES clinics(id) NOT NULL,
  asha_id      uuid REFERENCES staff(id),
  status       text DEFAULT 'registered' CHECK (status IN ('registered','triaged','in_queue','in_consult','completed','referred')),
  created_at   timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- ============================================================
-- 5. TRIAGE RECORDS (AI output — linked to visit)
-- ============================================================
CREATE TABLE IF NOT EXISTS triage_records (
  id                     uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id               uuid REFERENCES visits(id) NOT NULL,
  raw_inputs             jsonb NOT NULL,
  priority               text NOT NULL CHECK (priority IN ('P1','P2','P3')),
  confidence             float CHECK (confidence >= 0 AND confidence <= 1),
  reasoning              text,
  hard_override_triggered boolean DEFAULT false,
  override_rule          text,
  flags                  text[] DEFAULT '{}',
  recommend_vitals       text[] DEFAULT '{}',
  review_required        boolean DEFAULT false,
  human_reviewed         boolean DEFAULT false,
  reviewed_by            uuid REFERENCES staff(id),
  review_note            text,
  created_at             timestamptz DEFAULT now()
);

-- ============================================================
-- 6. QUEUE ENTRIES (real-time state — Realtime enabled)
-- ============================================================
CREATE TABLE IF NOT EXISTS queue_entries (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id   uuid REFERENCES visits(id) UNIQUE NOT NULL,
  clinic_id  uuid REFERENCES clinics(id) NOT NULL,
  priority   text NOT NULL CHECK (priority IN ('P1','P2','P3')),
  position   int NOT NULL,
  joined_at  timestamptz DEFAULT now(),
  called_at  timestamptz,
  status     text DEFAULT 'waiting' CHECK (status IN ('waiting','called','in_consult','no_show','done'))
);

-- ============================================================
-- 7. CONSULTATIONS (doctor session)
-- ============================================================
CREATE TABLE IF NOT EXISTS consultations (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id    uuid REFERENCES visits(id) NOT NULL,
  doctor_id   uuid REFERENCES staff(id),
  soap_brief  jsonb,
  notes       text,
  diagnosis   text,
  refer_to    text,
  started_at  timestamptz,
  ended_at    timestamptz,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- 8. PRESCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id  uuid REFERENCES consultations(id) NOT NULL,
  medications      jsonb NOT NULL DEFAULT '[]',
  pdf_url          text,
  sent_via         text[] DEFAULT '{}',
  sent_at          timestamptz,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- 9. FOLLOW-UPS (automated post-consultation pipeline)
-- ============================================================
CREATE TABLE IF NOT EXISTS followups (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id     uuid REFERENCES visits(id) NOT NULL,
  type         text NOT NULL CHECK (type IN ('medication_reminder','checkin','deterioration_alert','prescription_delivery')),
  scheduled_at timestamptz,
  sent_at      timestamptz,
  response     text,
  escalated    boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);

-- ============================================================
-- ENABLE REALTIME on queue_entries
-- (Also enable in Supabase Dashboard → Database → Replication)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE queue_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE triage_records;
ALTER PUBLICATION supabase_realtime ADD TABLE followups;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- For hackathon demo: open read, authenticated write
-- ============================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;

-- Allow all for demo (tighten in production)
CREATE POLICY "allow_all_patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_visits" ON visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_triage" ON triage_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_queue" ON queue_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_consultations" ON consultations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_prescriptions" ON prescriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_followups" ON followups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_clinics" ON clinics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_staff" ON staff FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- DEMO DATA SEED (3 pre-built patients for demo scenarios)
-- ============================================================
-- Patient A: Emergency (Scenario A - hard override P1)
INSERT INTO patients (id, phone, full_name, age, gender, village, known_conditions, allergies)
VALUES ('aaaaaaaa-0000-0000-0000-000000000001', '+910000000001', 'Ramesh Kumar', 62, 'male', 'Rampur', ARRAY['hypertension'], ARRAY[]::text[])
ON CONFLICT (phone) DO NOTHING;

-- Patient B: Ambiguous (Scenario B - confidence escalation P3→P2)
INSERT INTO patients (id, phone, full_name, age, gender, village, known_conditions, allergies)
VALUES ('bbbbbbbb-0000-0000-0000-000000000002', '+910000000002', 'Suresh Yadav', 34, 'male', 'Lucknow', ARRAY[]::text[], ARRAY[]::text[])
ON CONFLICT (phone) DO NOTHING;

-- Patient C: Standard ANC (Scenario C - clean P3)
INSERT INTO patients (id, phone, full_name, age, gender, village, known_conditions, allergies)
VALUES ('cccccccc-0000-0000-0000-000000000003', '+910000000003', 'Meena Devi', 29, 'female', 'Kanpur', ARRAY['pregnancy_28wks'], ARRAY[]::text[])
ON CONFLICT (phone) DO NOTHING;
