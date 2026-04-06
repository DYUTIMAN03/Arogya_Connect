# ArogyaConnect - Teleconsultation Triage System

**ArogyaConnect** is an advanced, AI-powered Teleconsultation Queue & Triage Management System designed for rural Primary Health Centers (PHCs). By integrating automated clinical triage, real-time queue management, and automated follow-ups, ArogyaConnect drastically reduces wait times, prioritizes critical patients instantly, and brings high-quality healthcare logic to resource-constrained environments.

---

## 🚀 Live Links (Hackathon Round 2 Submission)
> **❗️ EVALUATORS PLEASE NOTE ❗️**
> - **Deployment URL:** [YOUR_VERCEL_DEPLOYMENT_LINK_HERE]
> - **Public GitHub Repository:** https://github.com/DYUTIMAN03/Arogya_Connect

---

## 🌟 Key Features
- **AI-Powered Two-Stage Triage:** Utilizes an underlying LLM infrastructure (Groq/Llama3) to assess incoming patient symptoms and assign priorities (P1-Critical to P3-Non-Urgent) with confidence scores.
- **Real-Time Live Queue Management:** Implemented via Supabase Realtime subscriptions to seamlessly reorder and notify clinic staff of incoming patients.
- **Smart Coordination Dashboard:** Allowing coordinators to oversee patient flow, trigger manual overrides for edge cases, and view AI reasoning.
- **Follow-up Engine Pipeline:** Simulates WhatsApp/SMS interactions to ensure patient compliance and collect post-consultation vitals securely.
- **Beautiful UI / UX:** Responsive, premium interface featuring specialized animations and dark/light dynamic glassmorphism design.

## 🛠 Tech Stack
- **Frontend Framework:** Next.js 16 (App Router), React 19
- **Database & Realtime:** Supabase (PostgreSQL + Realtime Channels)
- **UI & Styling:** Tailwind CSS, Lucide React icons
- **Inference/AI:** Groq SDK for ultra-fast, low-latency API interactions
- **Teleconsultation Video:** Daily.co

## 💻 Code Quality & Architecture
This repository was developed with the "Development Phase" judging criteria in mind:
- **Strict Linting:** The application adheres strictly to standard Typescript practices and React hook rules.
- **Secure Handling:** Backend routes leverage Next.js API Routes, ensuring secure operations without exposing inference keys.
- **Production-Ready Build:** The application compiles successfully utilizing a strict Next.js compilation phase, minimizing dead code, unhandled promises, and warnings.

## 📥 Local Development

First, ensure your environment variables are set up in a `.env.local` file (Supabase keys, Groq API keys).

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the application locally.

## 🏆 Hackathon PS17 Notes
*Developed for Hackathon PS17 (Round 2).*
Code Quality and Secure Programming standards have been rigorously verified.
