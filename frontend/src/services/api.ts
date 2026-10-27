import { Trip, TripPreferences, DayItinerary, Activity } from '../types/itinerary';
import { SAMPLE_TRIPS } from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface HealthStatus {
  status: string;
  aiProvider: string;
  isAiConfigured: boolean;
  version: string;
}

export const checkBackendHealth = async (): Promise<HealthStatus | null> => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const generateItineraryAPI = async (
  prefs: TripPreferences
): Promise<{ trip: Trip; source: 'backend' | 'client-ai-engine' }> => {
  // First attempt to call the FastAPI backend
  try {
    const res = await fetch(`${API_BASE}/api/itinerary/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prefs),
    });

    if (res.ok) {
      const data = await res.json();
      return { trip: data.trip, source: 'backend' };
    }
  } catch (err) {
    console.warn('Backend unavailable, falling back to smart client generator:', err);
  }

  // Graceful smart generator fallback if backend is starting or offline
  const clientGeneratedTrip = generateSmartClientTrip(prefs);
  return { trip: clientGeneratedTrip, source: 'client-ai-engine' };
};

export const regenerateDayAPI = async (
  tripId: string,
  dayNumber: number,
  preferences: TripPreferences,
  customInstructions?: string
): Promise<DayItinerary> => {
  try {
    const res = await fetch(`${API_BASE}/api/itinerary/regenerate-day`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trip_id: tripId,
        day_number: dayNumber,
        preferences,
        custom_instructions: customInstructions,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.day;
    }
  } catch (err) {
    console.warn('Backend unavailable for day regeneration, generating locally:', err);
  }

  return generateAlternativeDay(dayNumber, preferences);
};

// Smart deterministic generator for any destination when offline or previewing
function generateSmartClientTrip(prefs: TripPreferences): Trip {
  const start = new Date(prefs.startDate || '2026-11-01');
  const end = new Date(prefs.endDate || '2026-11-04');
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const calculatedDays = Math.max(1, Math.min(10, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1));
  const numDays = prefs.destination.toLowerCase().includes('kyoto') ? 4 : calculatedDays;

  // Check if we have exact rich prebuilt match (like Kyoto or Paris)
  const destLower = prefs.destination.toLowerCase();
  const match = SAMPLE_TRIPS.find((t) => t.destination.toLowerCase().includes(destLower) || destLower.includes(t.destination.toLowerCase().split(',')[0].trim()));
  
  if (match) {
    return {
      ...match,
      id: `trip-${Date.now()}`,
      departureCity: prefs.departureCity || match.departureCity,
      startDate: prefs.startDate,
      endDate: prefs.endDate,
      budget: prefs.budget || match.budget,
      currency: prefs.currency || 'USD',
      travelers: prefs.travelers || 2,
      travelStyle: prefs.travelStyle || 'couple',
      pace: prefs.pace || 'moderate',
      interests: prefs.interests.length ? prefs.interests : match.interests,
    };
  }

  // Dynamic generator for arbitrary user destinations
  const days: DayItinerary[] = [];
  const baseLat = 35.6762; // Default fallback coord
  const baseLng = 139.6503;

  const themes = [
    'Arrival, Historic Landmarks & City Panorama',
    'Cultural Quarters, Local Artisans & Hidden Alleys',
    'Gastronomy Safari & Scenic Waterfront Sunset',
    'Art Galleries, Green Havens & Farewell Toast',
    'Adventure Excursion & Mountain Panorama',
    'Architectural Masterpieces & Nightlife Energy',
  ];

  for (let i = 1; i <= numDays; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(dayDate.getDate() + (i - 1));
    const dateStr = dayDate.toISOString().split('T')[0];

    const acts: Activity[] = [
      {
        id: `act-${i}-1`,
        time: '09:00 AM',
        period: 'morning',
        title: `Explore Iconic ${prefs.destination} Landmark`,
        description: `Immerse in the prime historical and architectural highlight of ${prefs.destination} with a guided morning walk.`,
        location: `${prefs.destination} Center`,
        coordinates: { lat: baseLat + (i * 0.01), lng: baseLng + (i * 0.01) },
        duration: '2.5 hours',
        cost: Math.round(15 * prefs.travelers),
        category: 'Sightseeing',
        bookingRequired: i === 1,
        tips: 'Visit early to capture the golden morning light with minimal crowds.',
      },
      {
        id: `act-${i}-2`,
        time: '01:30 PM',
        period: 'afternoon',
        title: `${prefs.interests[0] || 'Culture'} Experience in Old Quarter`,
        description: `Delve into authentic artisan workshops and regional craft traditions tailored to your ${prefs.interests.join(', ') || 'cultural'} interests.`,
        location: `Historic District, ${prefs.destination}`,
        coordinates: { lat: baseLat + (i * 0.012), lng: baseLng - (i * 0.008) },
        duration: '2 hours',
        cost: Math.round(25 * prefs.travelers),
        category: 'Cultural',
      },
      {
        id: `act-${i}-3`,
        time: '05:30 PM',
        period: 'evening',
        title: `Sunset Viewpoint & Riverfront Promenade`,
        description: `Watch dusk settle across ${prefs.destination}'s skyline from a panoramic terrace before dinner.`,
        location: `Riverfront Terrace, ${prefs.destination}`,
        coordinates: { lat: baseLat - (i * 0.005), lng: baseLng + (i * 0.015) },
        duration: '1.5 hours',
        cost: 0,
        category: 'Relaxation',
      },
    ];

    const dayCost = acts.reduce((acc, a) => acc + a.cost, 0) + 120 * prefs.travelers;

    days.push({
      dayNumber: i,
      date: dateStr,
      theme: themes[(i - 1) % themes.length],
      summary: `A carefully balanced ${prefs.pace} day celebrating the authentic sights and culinary treasures of ${prefs.destination}.`,
      activities: acts,
      meals: {
        breakfast: {
          type: 'breakfast',
          restaurant: `Café ${prefs.destination.split(',')[0]}`,
          cuisine: 'Fresh local bakery & specialty coffee',
          estimatedCost: 15 * prefs.travelers,
          description: 'Flaky pastries, seasonal fruits, and artisan coffee.',
        },
        lunch: {
          type: 'lunch',
          restaurant: `Trattoria del Sole`,
          cuisine: 'Regional specialty delicacies',
          estimatedCost: 35 * prefs.travelers,
          description: 'Handcrafted seasonal dishes highlighting locally harvested ingredients.',
        },
        dinner: {
          type: 'dinner',
          restaurant: `L'Heritage Sky Lounge`,
          cuisine: 'Contemporary Gastronomy',
          estimatedCost: 65 * prefs.travelers,
          description: 'Signature tasting course with scenic views over the illuminated cityscape.',
        },
      },
      accommodation: {
        name: `The Grand Sovereign ${prefs.destination.split(',')[0]}`,
        type: 'Boutique Hotel & Spa',
        neighborhood: 'Historic Center',
        pricePerNight: Math.round((prefs.budget / numDays) * 0.35),
        rating: 4.8,
        highlights: ['Central walking distance', 'Rooftop cocktail terrace', 'Complimentary breakfast'],
      },
      transport: {
        mode: 'Metro Transit Pass & Walking',
        description: 'Eco-friendly public transit connecting major city districts smoothly.',
        estimatedCost: 12 * prefs.travelers,
        duration: '35 mins daily',
      },
      dayCost,
    });
  }

  const estAccom = Math.round(days[0].accommodation.pricePerNight * numDays);
  const estAct = days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + a.cost, 0), 0);
  const estFood = days.reduce((sum, d) => sum + d.meals.breakfast.estimatedCost + d.meals.lunch.estimatedCost + d.meals.dinner.estimatedCost, 0);
  const estTrans = days.reduce((sum, d) => sum + d.transport.estimatedCost, 0);
  const estMisc = Math.round(prefs.budget * 0.05);

  return {
    id: `trip-${Date.now()}`,
    title: `${numDays}-Day Tailored ${prefs.destination} Journey`,
    destination: prefs.destination,
    departureCity: prefs.departureCity,
    startDate: prefs.startDate,
    endDate: prefs.endDate,
    durationDays: numDays,
    budget: prefs.budget,
    currency: prefs.currency,
    travelers: prefs.travelers,
    interests: prefs.interests,
    travelStyle: prefs.travelStyle,
    pace: prefs.pace,
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
    overview: `A bespoke ${numDays}-day itinerary for ${prefs.travelers} traveler(s) venturing from ${prefs.departureCity} to ${prefs.destination}, crafted for a ${prefs.pace} pace with emphasis on ${prefs.interests.join(', ') || 'local culture'}.`,
    days,
    expenses: {
      accommodation: estAccom,
      activities: estAct,
      food: estFood,
      transport: estTrans,
      miscellaneous: estMisc,
      total: estAccom + estAct + estFood + estTrans + estMisc,
      currency: prefs.currency,
    },
    isSaved: false,
    createdAt: new Date().toISOString(),
  };
}

function generateAlternativeDay(dayNumber: number, prefs: TripPreferences): DayItinerary {
  return {
    dayNumber,
    date: prefs.startDate || '2026-11-05',
    theme: `Alternative Explorer Experience: Hidden Jewels & Markets`,
    summary: `An alternative day itinerary reimagined with fresh off-the-beaten-path experiences and vibrant local food stalls.`,
    activities: [
      {
        id: `act-alt-${dayNumber}-1`,
        time: '09:30 AM',
        period: 'morning',
        title: 'Hidden Architectural Courtyards & Artisan Alley',
        description: 'Discover tucked-away gardens and historic private courtyards away from primary tourist paths.',
        location: `${prefs.destination} Old Quarter`,
        coordinates: { lat: 35.01, lng: 135.76 },
        duration: '2 hours',
        cost: 10,
        category: 'Cultural',
      },
      {
        id: `act-alt-${dayNumber}-2`,
        time: '01:30 PM',
        period: 'afternoon',
        title: 'Boutique Food & Flavor Tasting Experience',
        description: 'Taste regional delicacies curated by neighborhood purveyors and master vintners.',
        location: `Central Artisans Market`,
        coordinates: { lat: 35.015, lng: 135.765 },
        duration: '2.5 hours',
        cost: 35,
        category: 'Food',
      },
      {
        id: `act-alt-${dayNumber}-3`,
        time: '06:00 PM',
        period: 'evening',
        title: 'Lantern-Lit Jazz Bar & Skyline Views',
        description: 'Unwind with acoustic music and handcrafted botanical cocktails under the stars.',
        location: `Terrace District`,
        coordinates: { lat: 35.008, lng: 135.77 },
        duration: '2 hours',
        cost: 25,
        category: 'Entertainment',
      },
    ],
    meals: {
      breakfast: {
        type: 'breakfast',
        restaurant: 'Morning Roastery',
        cuisine: 'Specialty Cold Brew & Sourdough Toast',
        estimatedCost: 16,
        description: 'Freshly baked pastries and single-origin roast.',
      },
      lunch: {
        type: 'lunch',
        restaurant: 'Artisan Noodle Kitchen',
        cuisine: 'Hand-pulled Noodles & Dim Sum',
        estimatedCost: 26,
        description: 'Steam baskets and rich savory broth.',
      },
      dinner: {
        type: 'dinner',
        restaurant: 'The Garden Table',
        cuisine: 'Farm-to-Table Woodfired Plates',
        estimatedCost: 55,
        description: 'Organic vegetables and flame-grilled skewers.',
      },
    },
    accommodation: {
      name: 'Boutique Riverside Loft',
      type: 'Modern Boutique Hotel',
      neighborhood: 'Historic District',
      pricePerNight: 220,
      rating: 4.8,
      highlights: ['River views', 'Complimentary bikes'],
    },
    transport: {
      mode: 'Bicycle & Walking Tour',
      description: 'Scenic bike trails connecting quiet canals.',
      estimatedCost: 15,
      duration: 'Full day flexibility',
    },
    dayCost: 360,
  };
}
