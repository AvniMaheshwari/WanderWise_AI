# Supabase Setup Guide for WanderWise AI

Follow these instructions to connect your own live Supabase PostgreSQL database and authentication system to WanderWise AI.

---

## 1. Create a Supabase Project

1. Visit [https://supabase.com](https://supabase.com) and sign in or sign up.
2. Click **New Project**.
3. Choose your organization, project name (e.g. `wanderwise-ai`), and database password.
4. Select the region nearest to you and click **Create new project**.

---

## 2. Execute SQL Schema & Row Level Security

1. In your Supabase dashboard, click **SQL Editor** in the left navigation sidebar.
2. Click **New query**.
3. Open [`schema.sql`](file:///supabase/schema.sql) from this repository, copy the full contents, and paste into the Supabase SQL editor.
4. Click **Run** (or press `Ctrl+Enter`).
5. You should see `Success. No rows returned`.
6. Under **Table Editor**, verify that the 4 tables are present:
   - `profiles`
   - `trips`
   - `itinerary_days`
   - `activities`

---

## 3. Retrieve API Credentials

1. Go to **Project Settings** (gear icon) → **API**.
2. Copy:
   - **Project URL** (e.g. `https://xyzproject.supabase.co`)
   - **Project API Keys**:
     - `anon` `public` key (for frontend)
     - `service_role` key (optional for server-side administration)

---

## 4. Configure Environment Variables

### Frontend:
Open `frontend/.env` (or copy from `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your_anon_key_here
```

### Backend:
Open `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=8000
HOST=0.0.0.0
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key
```

---

## 5. Instant Demo Fallback

If you run WanderWise AI without configuring Supabase credentials, the application **automatically operates in Demo Mode**:
- Full interactive trip generation works immediately.
- Trips are persisted to browser local storage.
- Demo user `alex.wanderer@example.com` is automatically available for portfolio presentations.
- No crashes, blank pages, or broken buttons.
