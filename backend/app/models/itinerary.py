from typing import List, Optional
from pydantic import BaseModel, Field

class Coordinates(BaseModel):
    lat: float
    lng: float

class Activity(BaseModel):
    id: str
    time: str
    period: str  # morning, afternoon, evening
    title: str
    description: str
    location: str
    coordinates: Coordinates
    duration: str
    cost: float = Field(ge=0)
    category: str
    bookingRequired: Optional[bool] = False
    tips: Optional[str] = None

class MealRecommendation(BaseModel):
    type: str  # breakfast, lunch, dinner
    restaurant: str
    cuisine: str
    estimatedCost: float = Field(ge=0)
    description: str
    location: Optional[str] = None

class DayMeals(BaseModel):
    breakfast: MealRecommendation
    lunch: MealRecommendation
    dinner: MealRecommendation

class AccommodationSuggestion(BaseModel):
    name: str
    type: str
    neighborhood: str
    pricePerNight: float = Field(ge=0)
    rating: float = Field(ge=1.0, le=5.0)
    highlights: List[str] = []

class TransportOption(BaseModel):
    mode: str
    description: str
    estimatedCost: float = Field(ge=0)
    duration: str

class DayItinerary(BaseModel):
    dayNumber: int
    date: str
    theme: str
    summary: str
    activities: List[Activity]
    meals: DayMeals
    accommodation: AccommodationSuggestion
    transport: TransportOption
    dayCost: float = Field(ge=0)

class ExpenseBreakdown(BaseModel):
    accommodation: float = Field(ge=0)
    activities: float = Field(ge=0)
    food: float = Field(ge=0)
    transport: float = Field(ge=0)
    miscellaneous: float = Field(ge=0)
    total: float = Field(ge=0)
    currency: str = "USD"

class TripPreferences(BaseModel):
    destination: str
    departureCity: str = "Origin City"
    startDate: str
    endDate: str
    budget: float = Field(gt=0)
    currency: str = "USD"
    travelers: int = Field(ge=1, default=1)
    interests: List[str] = []
    travelStyle: str = "solo"
    pace: str = "moderate"

class TripResponse(BaseModel):
    id: str
    userId: Optional[str] = None
    title: str
    destination: str
    departureCity: str
    startDate: str
    endDate: str
    durationDays: int
    budget: float
    currency: str
    travelers: int
    interests: List[str]
    travelStyle: str
    pace: str
    coverImage: str
    overview: str
    days: List[DayItinerary]
    expenses: ExpenseBreakdown
    isSaved: Optional[bool] = False
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class RegenerateDayRequest(BaseModel):
    trip_id: str
    day_number: int
    preferences: TripPreferences
    custom_instructions: Optional[str] = None
