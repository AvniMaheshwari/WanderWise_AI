export type Period = 'morning' | 'afternoon' | 'evening';

export type ActivityCategory =
  | 'Sightseeing'
  | 'Cultural'
  | 'Adventure'
  | 'Relaxation'
  | 'Shopping'
  | 'Food'
  | 'Nature'
  | 'Entertainment';

export interface Activity {
  id: string;
  time: string;
  period: Period;
  title: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  duration: string;
  cost: number;
  category: ActivityCategory;
  bookingRequired?: boolean;
  tips?: string;
}

export interface MealRecommendation {
  type: 'breakfast' | 'lunch' | 'dinner';
  restaurant: string;
  cuisine: string;
  estimatedCost: number;
  description: string;
  location?: string;
}

export interface AccommodationSuggestion {
  name: string;
  type: string;
  neighborhood: string;
  pricePerNight: number;
  rating: number;
  highlights: string[];
}

export interface TransportOption {
  mode: string;
  description: string;
  estimatedCost: number;
  duration: string;
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  theme: string;
  summary: string;
  activities: Activity[];
  meals: {
    breakfast: MealRecommendation;
    lunch: MealRecommendation;
    dinner: MealRecommendation;
  };
  accommodation: AccommodationSuggestion;
  transport: TransportOption;
  dayCost: number;
}

export interface ExpenseBreakdown {
  accommodation: number;
  activities: number;
  food: number;
  transport: number;
  miscellaneous: number;
  total: number;
  currency: string;
}

export type TravelStyle = 'solo' | 'couple' | 'family' | 'friends' | 'business';
export type TravelPace = 'relaxed' | 'moderate' | 'fast';

export interface TripPreferences {
  destination: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  travelers: number;
  interests: string[];
  travelStyle: TravelStyle;
  pace: TravelPace;
}

export interface Trip {
  id: string;
  userId?: string;
  title: string;
  destination: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  budget: number;
  currency: string;
  travelers: number;
  interests: string[];
  travelStyle: TravelStyle;
  pace: TravelPace;
  coverImage: string;
  overview: string;
  days: DayItinerary[];
  expenses: ExpenseBreakdown;
  isSaved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  homeCurrency?: string;
}
