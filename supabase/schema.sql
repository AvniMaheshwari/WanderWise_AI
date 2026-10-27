-- ==============================================================================
-- WanderWise AI — Supabase PostgreSQL Schema with Row Level Security (RLS)
-- ==============================================================================

-- 1. Profiles Table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    home_currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_city TEXT DEFAULT 'Origin City',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    budget NUMERIC(10, 2) NOT NULL CHECK (budget > 0),
    currency TEXT DEFAULT 'USD',
    travelers INTEGER DEFAULT 1 CHECK (travelers > 0),
    interests JSONB DEFAULT '[]'::jsonb,
    travel_style TEXT DEFAULT 'solo',
    pace TEXT DEFAULT 'moderate',
    cover_image TEXT,
    overview TEXT,
    expenses JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Itinerary Days Table
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    date DATE NOT NULL,
    theme TEXT,
    summary TEXT,
    day_cost NUMERIC(10, 2) DEFAULT 0,
    meals JSONB DEFAULT '{}'::jsonb,
    accommodation JSONB DEFAULT '{}'::jsonb,
    transport JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    day_id TEXT NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    time TEXT NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('morning', 'afternoon', 'evening')),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    duration TEXT,
    cost NUMERIC(10, 2) DEFAULT 0 CHECK (cost >= 0),
    category TEXT DEFAULT 'Sightseeing',
    booking_required BOOLEAN DEFAULT FALSE,
    tips TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Indexes for High Performance Querying
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON public.trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON public.itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON public.activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON public.activities(trip_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Trips Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own trips or demo trips" ON public.trips;
CREATE POLICY "Users can read own trips or demo trips"
    ON public.trips FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert own trips" ON public.trips;
CREATE POLICY "Users can insert own trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own trips" ON public.trips;
CREATE POLICY "Users can update own trips"
    ON public.trips FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;
CREATE POLICY "Users can delete own trips"
    ON public.trips FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- ------------------------------------------------------------------------------
-- Itinerary Days Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read days of accessible trips" ON public.itinerary_days;
CREATE POLICY "Users can read days of accessible trips"
    ON public.itinerary_days FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itinerary_days.trip_id
            AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

DROP POLICY IF EXISTS "Users can manage days of accessible trips" ON public.itinerary_days;
CREATE POLICY "Users can manage days of accessible trips"
    ON public.itinerary_days FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itinerary_days.trip_id
            AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

-- ------------------------------------------------------------------------------
-- Activities Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read activities of accessible trips" ON public.activities;
CREATE POLICY "Users can read activities of accessible trips"
    ON public.activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = activities.trip_id
            AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

DROP POLICY IF EXISTS "Users can manage activities of accessible trips" ON public.activities;
CREATE POLICY "Users can manage activities of accessible trips"
    ON public.activities FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = activities.trip_id
            AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

-- ==============================================================================
-- Auth Trigger: Automatically create profile on new user sign up
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
