# WanderWise AI — Personalized Travel Itinerary Planner 🌍✈️

[![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20FastAPI%20%7C%20Supabase-00F0FF?style=for-the-badge)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

**WanderWise AI** is a full-stack, production-grade SaaS web application that crafts bespoke, day-by-day travel itineraries in seconds using structured generative AI intelligence. It features a midnight navy and electric cyan interface, precision budget validation, interactive geocoded route maps, selective day regeneration, granular activity editing, and cloud persistence with Supabase Row Level Security.

---

## 🌟 Key Features

1. **AI-Synthesized Itineraries**: Generates multi-day schedules with morning, afternoon, and evening slots, realistic durations, dining picks, lodging recommendations, and estimated expenses.
2. **Selective Day Regeneration**: Dislike Day 2 or Day 4? Regenerate only that specific day with custom instructions without erasing the rest of your trip.
3. **Real-Time Budget Validation**: Automatically tabulates spending across lodging, food, activities, and transit, displaying warnings if the plan exceeds the traveler's target budget.
4. **Interactive Leaflet Route Maps**: Real GPS coordinates mapped for every activity, with numbered pins, daily path corridors, and popup highlights.
5. **Full Activity Customizer**: Add custom stops, edit timings, costs, durations, and notes, or delete activities with automatic total recalculation.
6. **Supabase Authentication & Row Level Security**: Secure user signup, login, session management, and per-user isolated trip persistence.
7. **Instant Demo Mode**: Operates out of the box with zero external configuration required for portfolio reviewers and grading panels.

---

## 🏗️ Project Architecture

```
wanderwise-ai/
├── frontend/                     # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/             # Supabase Auth modal & demo switcher
│   │   │   ├── Budget/           # Real-time expense validation & distribution
│   │   │   ├── Dashboard/        # Saved trips dashboard with search & stats
│   │   │   ├── Itinerary/        # Day cards, activity timeline, day regenerator
│   │   │   ├── Map/              # Leaflet geocoded route map & popups
│   │   │   ├── TripBuilder/      # Multi-field trip planner wizard
│   │   │   └── UI/               # High-contrast badges, glowing loaders, toasts
│   │   ├── context/              # AuthContext (Supabase + Demo)
│   │   ├── services/             # API client, Supabase client, mock dataset
│   │   ├── types/                # Strict TypeScript data models
│   │   ├── App.tsx               # Primary application coordinator
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                      # Python FastAPI with Pydantic v2
│   ├── app/
│   │   ├── models/               # Pydantic schemas (TripPreferences, DayItinerary)
│   │   ├── routers/              # /api/itinerary, /api/trips, /api/health
│   │   ├── services/             # Gemini AI integration & smart deterministic engine
│   │   └── config.py             # Server settings & environment validation
│   ├── main.py                   # FastAPI app entry point & CORS
│   └── requirements.txt
├── supabase/
│   ├── schema.sql                # Complete PostgreSQL DDL with RLS policies & triggers
│   └── README.md                 # Supabase setup guide
├── .env.example                  # Environment variable reference
└── README.md                     # Documentation
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+) & pip

---

### Step 1: Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be live at:
👉 **`http://localhost:5173`**

*(Note: The frontend includes an Instant Demo Engine. You can test full itinerary generation, budget validation, and local persistence immediately without starting the backend if desired!)*

---

### Step 2: Run the FastAPI Backend

Open a separate terminal window:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend server will start on:
👉 **`http://localhost:8000`**
- Interactive Swagger API docs: **`http://localhost:8000/docs`**
- Health status check: **`http://localhost:8000/api/health`**

---

### Step 3: Configure Generative AI (Optional)

In `backend/.env`:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
```

> **Note on AI Keys**: WanderWise AI never exposes private API keys to the frontend. All AI calls route through the FastAPI server. If no API key is provided, the backend seamlessly activates its **Intelligent Fallback Engine**, providing rich, realistic, geocoded itineraries for any global destination.

---

### Step 4: Configure Supabase Database (Optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](file:///supabase/schema.sql).
3. Copy your project URL and anon public key to `frontend/.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Now all user signups and saved trips persist into your real Supabase PostgreSQL database governed by Row Level Security!

---

## 🔒 Security & Data Integrity

- **Server-Side Key Isolation**: AI keys and sensitive credentials remain strictly on the FastAPI server in `.env`.
- **Pydantic Validation**: All inbound generation requests and outbound AI outputs are validated against strict Pydantic models before returning to clients.
- **Supabase Row Level Security (RLS)**: Enforces table policies ensuring users can only read, write, and delete their own itineraries (`auth.uid() = user_id`).
- **Input Sanitization**: Request bodies are type-checked and numeric constraints prevent negative costs or budgets.

---

## 🚢 Deployment Instructions

### Frontend (Vercel / Netlify)
1. Push code to GitHub.
2. Import `frontend` directory into Vercel or Netlify.
3. Build command: `npm run build`, Output directory: `dist`.
4. Add environment variables: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

### Backend (Render / Railway / Fly.io)
1. Create a new Web Service pointing to `backend/`.
2. Build command: `pip install -r requirements.txt`.
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Add environment variables: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`.

---

## 📄 License
MIT License. Created for student portfolio demonstrations and modern travel enthusiasts.
