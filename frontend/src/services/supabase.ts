import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Trip, UserProfile } from '../types/itinerary';
import { SAMPLE_TRIPS } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('placeholder')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage key for demo mode persistence
const LOCAL_STORAGE_TRIPS_KEY = 'wanderwise_demo_trips_v1';
const LOCAL_STORAGE_USER_KEY = 'wanderwise_demo_user_v1';

export const getStoredDemoTrips = (): Trip[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(SAMPLE_TRIPS));
      return SAMPLE_TRIPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse demo trips from localStorage', e);
    return SAMPLE_TRIPS;
  }
};

export const saveDemoTrip = (trip: Trip): Trip[] => {
  const current = getStoredDemoTrips();
  const existingIdx = current.findIndex((t) => t.id === trip.id);
  let updated: Trip[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...trip, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...trip, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  }
  localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteDemoTrip = (tripId: string): Trip[] => {
  const current = getStoredDemoTrips();
  const filtered = current.filter((t) => t.id !== tripId);
  localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(filtered));
  return filtered;
};

// Database integration services
export const tripService = {
  async fetchTrips(userId?: string): Promise<Trip[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return getStoredDemoTrips();
    }

    try {
      let query = supabase
        .from('trips')
        .select(`
          id,
          user_id,
          title,
          destination,
          departure_city,
          start_date,
          end_date,
          duration_days,
          budget,
          currency,
          travelers,
          interests,
          travel_style,
          pace,
          cover_image,
          overview,
          expenses,
          created_at,
          updated_at,
          itinerary_days (
            id,
            day_number,
            date,
            theme,
            summary,
            day_cost,
            meals,
            accommodation,
            transport,
            activities (
              id,
              time,
              period,
              title,
              description,
              location,
              coordinates,
              duration,
              cost,
              category,
              booking_required,
              tips
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Supabase fetch error, using local demo fallback:', error.message);
        return getStoredDemoTrips();
      }

      if (!data || data.length === 0) {
        return getStoredDemoTrips();
      }

      // Map Supabase snake_case to TypeScript camelCase models
      return data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        title: d.title,
        destination: d.destination,
        departureCity: d.departure_city,
        startDate: d.start_date,
        endDate: d.end_date,
        durationDays: d.duration_days,
        budget: Number(d.budget),
        currency: d.currency || 'USD',
        travelers: d.travelers || 1,
        interests: Array.isArray(d.interests) ? d.interests : [],
        travelStyle: d.travel_style || 'solo',
        pace: d.pace || 'moderate',
        coverImage: d.cover_image,
        overview: d.overview,
        expenses: d.expenses || {
          accommodation: 0,
          activities: 0,
          food: 0,
          transport: 0,
          miscellaneous: 0,
          total: 0,
          currency: d.currency || 'USD',
        },
        isSaved: true,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        days: (d.itinerary_days || [])
          .sort((a: any, b: any) => a.day_number - b.day_number)
          .map((day: any) => ({
            dayNumber: day.day_number,
            date: day.date,
            theme: day.theme,
            summary: day.summary,
            dayCost: Number(day.day_cost || 0),
            meals: day.meals || {
              breakfast: { type: 'breakfast', restaurant: 'Local Café', cuisine: 'Local', estimatedCost: 15, description: 'Morning breakfast' },
              lunch: { type: 'lunch', restaurant: 'Bistro', cuisine: 'Local', estimatedCost: 25, description: 'Lunch' },
              dinner: { type: 'dinner', restaurant: 'Trattoria', cuisine: 'Local', estimatedCost: 45, description: 'Dinner' },
            },
            accommodation: day.accommodation || {
              name: 'Recommended Hotel',
              type: 'Boutique Hotel',
              neighborhood: 'City Center',
              pricePerNight: 150,
              rating: 4.5,
              highlights: ['Central location'],
            },
            transport: day.transport || {
              mode: 'Public Transit / Metro',
              description: 'Standard day pass',
              estimatedCost: 10,
              duration: 'Flexible',
            },
            activities: (day.activities || []).map((act: any) => ({
              id: act.id,
              time: act.time,
              period: act.period,
              title: act.title,
              description: act.description,
              location: act.location,
              coordinates: act.coordinates || { lat: 0, lng: 0 },
              duration: act.duration,
              cost: Number(act.cost || 0),
              category: act.category || 'Sightseeing',
              bookingRequired: act.booking_required,
              tips: act.tips,
            })),
          })),
      }));
    } catch (err) {
      console.error('Failed to query Supabase trips', err);
      return getStoredDemoTrips();
    }
  },

  async saveTrip(trip: Trip, userId?: string): Promise<{ success: boolean; trip: Trip; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      saveDemoTrip(trip);
      return { success: true, trip: { ...trip, isSaved: true } };
    }

    try {
      // 1. Insert/Upsert Trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .upsert({
          id: trip.id,
          user_id: userId || null,
          title: trip.title,
          destination: trip.destination,
          departure_city: trip.departureCity,
          start_date: trip.startDate,
          end_date: trip.endDate,
          duration_days: trip.durationDays,
          budget: trip.budget,
          currency: trip.currency,
          travelers: trip.travelers,
          interests: trip.interests,
          travel_style: trip.travelStyle,
          pace: trip.pace,
          cover_image: trip.coverImage,
          overview: trip.overview,
          expenses: trip.expenses,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (tripError) throw tripError;

      // 2. Upsert Days
      for (const day of trip.days) {
        const dayId = `${trip.id}-day-${day.dayNumber}`;
        const { error: dayError } = await supabase
          .from('itinerary_days')
          .upsert({
            id: dayId,
            trip_id: trip.id,
            day_number: day.dayNumber,
            date: day.date,
            theme: day.theme,
            summary: day.summary,
            day_cost: day.dayCost,
            meals: day.meals,
            accommodation: day.accommodation,
            transport: day.transport,
          });

        if (dayError) throw dayError;

        // 3. Upsert Activities
        for (const act of day.activities) {
          const { error: actError } = await supabase
            .from('activities')
            .upsert({
              id: act.id,
              day_id: dayId,
              trip_id: trip.id,
              time: act.time,
              period: act.period,
              title: act.title,
              description: act.description,
              location: act.location,
              coordinates: act.coordinates,
              duration: act.duration,
              cost: act.cost,
              category: act.category,
              booking_required: act.bookingRequired || false,
              tips: act.tips || '',
            });

          if (actError) throw actError;
        }
      }

      // Also sync to demo store as local cache
      saveDemoTrip(trip);
      return { success: true, trip: { ...trip, isSaved: true } };
    } catch (err: any) {
      console.error('Supabase save error, persisting locally:', err);
      saveDemoTrip(trip);
      return { success: true, trip: { ...trip, isSaved: true }, error: err.message };
    }
  },

  async deleteTrip(tripId: string): Promise<boolean> {
    deleteDemoTrip(tripId);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('trips').delete().eq('id', tripId);
        if (error) console.error('Supabase delete error:', error.message);
      } catch (e) {
        console.error('Failed to delete from Supabase', e);
      }
    }
    return true;
  },
};
