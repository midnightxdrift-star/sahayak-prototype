# 🎓 SAHAYAK (सहायक)
### *Unified Scholarship & Direct Benefit Transfer (DBT) Mobile Platform for Tribal & Underrepresented Students*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Overview

**SAHAYAK (सहायक)** is a mobile-first digital platform built to bridge the gap between underrepresented students—particularly from **Scheduled Tribe (ST)** communities—and government scholarship schemes like the **Ministry of Tribal Affairs (MoTA) Pre-Matric & Post-Matric Scholarships**.

Many eligible students miss out on financial aid due to complex government portals, language barriers, repetitive document submission, and opaque disbursement tracking. **SAHAYAK** solves this with a lightweight, accessible mobile experience powered by **JAGO (जागो)**, an intelligent bilingual AI assistant.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 📱 **Mobile-First Prototype** | Optimized for low-bandwidth mobile devices with responsive smartphone framing. |
| 🌐 **Bilingual Support (हिंदी / English)** | Full real-time interface localization in Hindi and English. |
| 🤖 **JAGO AI Assistant (जागो)** | Context-aware AI chatbot that answers questions about application status, document renewals, and eligibility. |
| 📂 **One-Time Document Wallet** | Upload once, reuse across applications. Notifies students when certificates (e.g., Income Certificate) are expiring. |
| 💳 **Real-Time DBT & PFMS Tracking** | Transparent progress tracking from application sanction to Aadhaar-seeded bank credit. |
| 📶 **Resilient Offline Architecture** | Automatically falls back to offline cached mock data if the backend server is unreachable. |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([📱 Student / User]) --> Frontend[React 18 + Vite Mobile Client]
    
    subgraph Client [Frontend Layer]
        Frontend --> UI[Tailwind UI & Civic Sans Design]
        Frontend --> Router[Screen Navigation]
        Frontend --> APIService[API Service Layer + Fallback Engine]
    end

    subgraph Server [Backend Layer - FastAPI]
        APIService -->|HTTP / JSON| FastAPIServer[FastAPI Server :8000]
        FastAPIServer --> StudentAPI[/api/student]
        FastAPIServer --> ScholarshipAPI[/api/scholarships]
        FastAPIServer --> TrackerAPI[/api/applications]
        FastAPIServer --> WalletAPI[/api/documents]
        FastAPIServer --> PaymentAPI[/api/payments]
        FastAPIServer --> JagoAPI[/api/jago & /api/v1/chat]
    end

    subgraph Intelligence [AI & Data]
        JagoAPI --> LLMService[JAGO AI Service Engine]
        LLMService -->|API Key| CloudLLM[xAI Grok / OpenAI / Groq]
        LLMService -->|Fallback| RuleEngine[Deterministic Context Grounding]
        FastAPIServer --> MockDB[(Centralized Mock Data Store)]
    end
```

---

## 🚀 Quick Start Guide

You can run SAHAYAK locally in just a few minutes. Both frontend and backend can run together, or you can run the frontend completely standalone with built-in mock fallback!

### Prerequisites
Make sure you have installed:
* **Node.js** (v18 or higher) — [Download Node.js](https://nodejs.org/)
* **Python** (v3.10 or higher) — [Download Python](https://python.org/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/midnightxdrift-star/sahayak-prototype.git
cd sahayak-prototype
```

---

### Step 2: Start the Frontend (React + Vite)
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```
👉 Open your browser at **`http://localhost:5173`** to interact with the mobile app.

---

### Step 3: Start the Backend (FastAPI - Optional but Recommended)
Open a new terminal in the `sahayak-prototype` root folder:

```bash
# 1. Install backend requirements
pip install -r backend/requirements.txt

# 2. Launch the backend server
python run_server.py
```
👉 The API will be live at **`http://127.0.0.1:8000`**  
👉 Interactive API documentation (Swagger UI) is available at **`http://127.0.0.1:8000/docs`**

---

## ⚙️ AI Assistant Configuration (JAGO)

The JAGO assistant is designed to work **even without an external API key** using grounded context rules. 

To connect JAGO to live Cloud LLMs (Grok, OpenAI, or Groq):
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your preferred API key:
   ```env
   # Option 1: xAI Grok (Default)
   GROK_API_KEY=your_key_here
   GROK_MODEL=grok-2-latest

   # Option 2: Groq (Free & Fast)
   # GROQ_API_KEY=gsk_your_groq_key_here
   # GROK_MODEL=llama-3.3-70b-versatile
   ```

---

## 🧪 Automated Testing

SAHAYAK includes end-to-end and unit test suites:

```bash
# Run backend test suite
python -m pytest backend/test_backend.py
```

---

## 📂 Project Structure

```text
sahayak-prototype/
├── backend/                  # FastAPI REST API
│   ├── core/                 # Configuration and CORS
│   ├── data/                 # Scholarship, student & DBT data models
│   ├── routes/               # API endpoints (Student, JAGO, Wallet, DBT)
│   ├── schemas/              # Pydantic validation schemas
│   ├── services/             # JAGO AI conversational logic
│   └── test_backend.py       # Automated API test suite
├── public/                   # Static branding, emblems & audio assets
├── src/                      # React Frontend
│   ├── components/           # Reusable UI (Status bar, Nav bar, Headers)
│   ├── locales/              # English & Hindi translation dictionaries
│   ├── pages/                # Screen implementations (14 core modules)
│   │   ├── onboarding/       # Splash, Language selection, Login OTP
│   │   ├── home/             # Student dashboard & quick actions
│   │   ├── scholarships/     # Schemes list & detailed requirements
│   │   ├── jago/             # Bilingual AI Chatbot interface
│   │   ├── documents/        # Document wallet & reuse system
│   │   ├── applications/     # Application status & timeline tracker
│   │   └── payments/         # DBT & PFMS bank disbursement ledger
│   └── services/             # Centralized API layer with offline fallback
├── package.json              # Frontend dependencies and scripts
├── run_server.py             # Single-command FastAPI launcher
└── tailwind.config.js        # Theme colors and civic typography
```

---

## 🌐 Deployment

* **Frontend:** Ready for one-click deployment on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). Run `npm run build` to generate the production bundle in `dist/`.
* **Backend:** Deployable on [Render](https://render.com/), [Railway](https://railway.app/), or [Fly.io](https://fly.io/) using standard Uvicorn worker.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
