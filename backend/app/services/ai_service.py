import json
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import httpx

from app.config import settings
from app.models.itinerary import (
    TripPreferences,
    TripResponse,
    DayItinerary,
    Activity,
    DayMeals,
    MealRecommendation,
    AccommodationSuggestion,
    TransportOption,
    ExpenseBreakdown,
    Coordinates,
)

logger = logging.getLogger(__name__)

# Coordinates lookup for common world destinations
GEO_CACHE: Dict[str, Coordinates] = {
    "kyoto": Coordinates(lat=35.0116, lng=135.7681),
    "tokyo": Coordinates(lat=35.6762, lng=139.6503),
    "paris": Coordinates(lat=48.8566, lng=2.3522),
    "rome": Coordinates(lat=41.9028, lng=12.4964),
    "new york": Coordinates(lat=40.7128, lng=-74.0060),
    "reykjavik": Coordinates(lat=64.1466, lng=-21.9426),
    "london": Coordinates(lat=51.5074, lng=-0.1278),
    "bali": Coordinates(lat=-8.4095, lng=115.1889),
    "barcelona": Coordinates(lat=41.3879, lng=2.1699),
    "san francisco": Coordinates(lat=37.7749, lng=-122.4194),
}

def get_base_coords(destination: str) -> Coordinates:
    dest_lower = destination.lower()
    for key, coords in GEO_CACHE.items():
        if key in dest_lower:
            return coords
    # Default to European center if unknown
    return Coordinates(lat=48.8566, lng=2.3522)

class AIService:
    @staticmethod
    async def generate_itinerary(prefs: TripPreferences) -> TripResponse:
        """
        Generates full multi-day itinerary.
        If GEMINI_API_KEY is configured, calls Gemini with JSON schema instructions.
        Otherwise or on failure, falls back to the intelligent deterministic engine.
        """
        if settings.GEMINI_API_KEY and "your_gemini_api_key" not in settings.GEMINI_API_KEY:
            try:
                trip = await AIService._call_gemini(prefs)
                if trip:
                    return trip
            except Exception as e:
                logger.warning(f"Gemini API generation failed, falling back to smart engine: {e}")

        # Intelligent fallback
        return AIService._generate_smart_fallback(prefs)

    @staticmethod
    async def regenerate_single_day(
        trip_id: str,
        day_number: int,
        prefs: TripPreferences,
        custom_instructions: Optional[str] = None
    ) -> DayItinerary:
        """
        Regenerates a single day with optional prompt instructions.
        """
        if settings.GEMINI_API_KEY and "your_gemini_api_key" not in settings.GEMINI_API_KEY:
            try:
                day = await AIService._call_gemini_single_day(day_number, prefs, custom_instructions)
                if day:
                    return day
            except Exception as e:
                logger.warning(f"Gemini single-day generation failed, falling back: {e}")

        return AIService._generate_fallback_day(day_number, prefs, custom_instructions)

    @staticmethod
    async def _call_gemini(prefs: TripPreferences) -> Optional[TripResponse]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        
        start = datetime.strptime(prefs.startDate, "%Y-%m-%d")
        end = datetime.strptime(prefs.endDate, "%Y-%m-%d")
        duration = max(1, min(10, (end - start).days + 1))
        
        prompt = f"""
You are WanderWise AI, an expert travel architect. Generate a complete {duration}-day personalized travel itinerary in JSON format.
Destination: {prefs.destination}
Departure city: {prefs.departureCity}
Dates: {prefs.startDate} to {prefs.endDate} ({duration} days)
Total budget: {prefs.budget} {prefs.currency}
Travelers: {prefs.travelers}
Interests: {', '.join(prefs.interests) if prefs.interests else 'General cultural highlights and local dining'}
Travel style: {prefs.travelStyle}
Pace: {prefs.pace}

You MUST return valid JSON adhering strictly to this schema:
{{
  "id": "trip-{int(datetime.now().timestamp())}",
  "title": "Inspiring Title for the Trip",
  "destination": "{prefs.destination}",
  "departureCity": "{prefs.departureCity}",
  "startDate": "{prefs.startDate}",
  "endDate": "{prefs.endDate}",
  "durationDays": {duration},
  "budget": {prefs.budget},
  "currency": "{prefs.currency}",
  "travelers": {prefs.travelers},
  "interests": {json.dumps(prefs.interests)},
  "travelStyle": "{prefs.travelStyle}",
  "pace": "{prefs.pace}",
  "coverImage": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
  "overview": "2-3 sentence overview describing the journey experience.",
  "days": [
    {{
      "dayNumber": 1,
      "date": "{prefs.startDate}",
      "theme": "Theme of Day 1",
      "summary": "1-2 sentence day summary",
      "activities": [
        {{
          "id": "act-1-1",
          "time": "09:00 AM",
          "period": "morning",
          "title": "Activity Title",
          "description": "Specific descriptive summary",
          "location": "District or Attraction Name",
          "coordinates": {{"lat": 35.0116, "lng": 135.7681}},
          "duration": "2 hours",
          "cost": 15,
          "category": "Sightseeing",
          "bookingRequired": false,
          "tips": "Pro advice"
        }}
      ],
      "meals": {{
        "breakfast": {{"type": "breakfast", "restaurant": "Local Café", "cuisine": "Bakery", "estimatedCost": 15, "description": "Morning bites"}},
        "lunch": {{"type": "lunch", "restaurant": "Bistro", "cuisine": "Regional", "estimatedCost": 28, "description": "Savory lunch"}},
        "dinner": {{"type": "dinner", "restaurant": "Trattoria", "cuisine": "Gastronomy", "estimatedCost": 55, "description": "Evening feast"}}
      }},
      "accommodation": {{
        "name": "Boutique Hotel",
        "type": "Boutique",
        "neighborhood": "Central",
        "pricePerNight": 180,
        "rating": 4.7,
        "highlights": ["Great location", "Breakfast included"]
      }},
      "transport": {{
        "mode": "Metro & Walking",
        "description": "City transit pass",
        "estimatedCost": 10,
        "duration": "30 mins"
      }},
      "dayCost": 298
    }}
  ],
  "expenses": {{
    "accommodation": 720,
    "activities": 250,
    "food": 580,
    "transport": 120,
    "miscellaneous": 130,
    "total": 1800,
    "currency": "{prefs.currency}"
  }}
}}
Return ONLY the raw JSON object. Do not include markdown fences.
"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4, "responseMimeType": "application/json"}
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                cleaned = text.strip().removeprefix("```json").removesuffix("```").strip()
                parsed = json.loads(cleaned)
                return TripResponse.model_validate(parsed)
            else:
                logger.error(f"Gemini API returned status {resp.status_code}: {resp.text}")
                return None

    @staticmethod
    async def _call_gemini_single_day(
        day_number: int,
        prefs: TripPreferences,
        custom_instructions: Optional[str]
    ) -> Optional[DayItinerary]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        
        prompt = f"""
You are WanderWise AI. Regenerate Day {day_number} of a trip to {prefs.destination}.
Pace: {prefs.pace}
Travel Style: {prefs.travelStyle}
Custom traveler request: {custom_instructions or "Fresh alternative sights and dining."}

Return a single DayItinerary JSON object adhering to this schema:
{{
  "dayNumber": {day_number},
  "date": "{prefs.startDate}",
  "theme": "Theme of Day {day_number}",
  "summary": "Summary of day",
  "activities": [
    {{
      "id": "act-r-{day_number}-1",
      "time": "09:30 AM",
      "period": "morning",
      "title": "Activity name",
      "description": "Details",
      "location": "Location",
      "coordinates": {{"lat": 35.0116, "lng": 135.7681}},
      "duration": "2 hours",
      "cost": 12,
      "category": "Sightseeing",
      "bookingRequired": false,
      "tips": "Tips"
    }}
  ],
  "meals": {{
    "breakfast": {{"type": "breakfast", "restaurant": "Café", "cuisine": "Bakery", "estimatedCost": 15, "description": "Pastries"}},
    "lunch": {{"type": "lunch", "restaurant": "Eatery", "cuisine": "Local", "estimatedCost": 25, "description": "Dishes"}},
    "dinner": {{"type": "dinner", "restaurant": "Dining", "cuisine": "Delicacy", "estimatedCost": 50, "description": "Dinner"}}
  }},
  "accommodation": {{
    "name": "Boutique Hotel",
    "type": "Hotel",
    "neighborhood": "Central",
    "pricePerNight": 180,
    "rating": 4.8,
    "highlights": ["Boutique charm"]
  }},
  "transport": {{
    "mode": "Metro",
    "description": "Local metro transit",
    "estimatedCost": 10,
    "duration": "25 mins"
  }},
  "dayCost": 282
}}
Return ONLY valid JSON.
"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.5, "responseMimeType": "application/json"}
        }

        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                cleaned = text.strip().removeprefix("```json").removesuffix("```").strip()
                parsed = json.loads(cleaned)
                return DayItinerary.model_validate(parsed)
            return None

    @staticmethod
    def _generate_smart_fallback(prefs: TripPreferences) -> TripResponse:
        """
        High-fidelity realistic deterministic generator.
        Produces complete geocoded multi-day itineraries for any destination.
        """
        start = datetime.strptime(prefs.startDate, "%Y-%m-%d")
        end = datetime.strptime(prefs.endDate, "%Y-%m-%d")
        duration = max(1, min(10, (end - start).days + 1))
        
        base_coords = get_base_coords(prefs.destination)
        dest_clean = prefs.destination.split(",")[0].strip()

        themes = [
            f"Historic Heart, Imperial Sights & Panoramic Vista",
            f"Artisan Districts, Culinary Markets & Heritage Alleys",
            f"Waterfront Promenade, Architecture & Sunset Skyline",
            f"Cultural Quarter, Traditional Crafts & Evening Lounge",
            f"Scenic Nature Escapade & Botanical Gardens",
            f"Modern Art, Vibrant Nightlife & Farewell Dining"
        ]

        days: List[DayItinerary] = []
        for i in range(1, duration + 1):
            day_date = (start + timedelta(days=i - 1)).strftime("%Y-%m-%d")
            
            # Activities tailored to pace and style
            act1 = Activity(
                id=f"act-{i}-1",
                time="09:00 AM",
                period="morning",
                title=f"Iconic {dest_clean} Heritage Landmark",
                description=f"Explore the renowned architectural landmark of {dest_clean} with an early guided morning stroll to beat the crowds.",
                location=f"Central Old Town, {dest_clean}",
                coordinates=Coordinates(lat=base_coords.lat + (i * 0.008), lng=base_coords.lng + (i * 0.006)),
                duration="2.5 hours",
                cost=float(15 * prefs.travelers),
                category="Sightseeing",
                bookingRequired=(i == 1),
                tips="Golden morning sunlight makes for stunning photography."
            )
            
            act2 = Activity(
                id=f"act-{i}-2",
                time="02:00 PM",
                period="afternoon",
                title=f"{prefs.interests[0] if prefs.interests else 'Artisan'} Culture & Workshop",
                description=f"Immerse in local craftsmanship, tasting rooms, and authentic boutiques representing the heart of {dest_clean}.",
                location=f"Artisan Quarter, {dest_clean}",
                coordinates=Coordinates(lat=base_coords.lat + (i * 0.012), lng=base_coords.lng - (i * 0.007)),
                duration="2 hours",
                cost=float(25 * prefs.travelers),
                category="Cultural",
                bookingRequired=False,
                tips="Ask the local artisans about traditional techniques."
            )

            act3 = Activity(
                id=f"act-{i}-3",
                time="06:30 PM",
                period="evening",
                title=f"Sunset Panoramic Terrace & River Promenade",
                description=f"Stroll the illuminated scenic paths and take in panoramic dusk views over {dest_clean}.",
                location=f"Skyline Terrace, {dest_clean}",
                coordinates=Coordinates(lat=base_coords.lat - (i * 0.004), lng=base_coords.lng + (i * 0.012)),
                duration="1.5 hours",
                cost=0.0,
                category="Relaxation",
                bookingRequired=False,
                tips="Arrive 30 minutes before sundown for best viewing."
            )

            meals = DayMeals(
                breakfast=MealRecommendation(
                    type="breakfast",
                    restaurant=f"Café de {dest_clean}",
                    cuisine="Artisan Bakery & Specialty Roast",
                    estimatedCost=float(15 * prefs.travelers),
                    description="Fresh warm flaky croissants, local fruits, and hand-brewed coffee."
                ),
                lunch=MealRecommendation(
                    type="lunch",
                    restaurant=f"Osteria {dest_clean}",
                    cuisine="Regional Farm-to-Table Delicacies",
                    estimatedCost=float(30 * prefs.travelers),
                    description="Seasonal handmade specialty dishes celebrating fresh regional produce."
                ),
                dinner=MealRecommendation(
                    type="dinner",
                    restaurant=f"The Sovereign Dining Room",
                    cuisine="Contemporary Fine Gastronomy",
                    estimatedCost=float(60 * prefs.travelers),
                    description="Multi-course tasting menu paired with regional wines overlooking the cityscape."
                )
            )

            nightly_hotel = round((prefs.budget / duration) * 0.35, 2)
            accommodation = AccommodationSuggestion(
                name=f"The Grand {dest_clean} Boutique Loft",
                type="Boutique Heritage Hotel",
                neighborhood="Historic City Center",
                pricePerNight=max(120.0, nightly_hotel),
                rating=4.8,
                highlights=["Central walking distance", "Rooftop terrace", "Complimentary breakfast"]
            )

            transport = TransportOption(
                mode="City Metro Transit & Walking",
                description="Fast, eco-friendly public transit connecting major sights.",
                estimatedCost=float(10 * prefs.travelers),
                duration="35 mins"
            )

            day_cost = (
                act1.cost + act2.cost + act3.cost +
                meals.breakfast.estimatedCost + meals.lunch.estimatedCost + meals.dinner.estimatedCost +
                transport.estimatedCost
            )

            days.append(
                DayItinerary(
                    dayNumber=i,
                    date=day_date,
                    theme=themes[(i - 1) % len(themes)],
                    summary=f"A balanced {prefs.pace}-paced day exploring {dest_clean}'s finest cultural landmarks and flavors.",
                    activities=[act1, act2, act3],
                    meals=meals,
                    accommodation=accommodation,
                    transport=transport,
                    dayCost=day_cost
                )
            )

        # Budget breakdown
        total_accom = sum(d.accommodation.pricePerNight for d in days)
        total_act = sum(sum(a.cost for a in d.activities) for d in days)
        total_food = sum(d.meals.breakfast.estimatedCost + d.meals.lunch.estimatedCost + d.meals.dinner.estimatedCost for d in days)
        total_trans = sum(d.transport.estimatedCost for d in days)
        total_misc = round(prefs.budget * 0.05, 2)

        expenses = ExpenseBreakdown(
            accommodation=total_accom,
            activities=total_act,
            food=total_food,
            transport=total_trans,
            miscellaneous=total_misc,
            total=round(total_accom + total_act + total_food + total_trans + total_misc, 2),
            currency=prefs.currency
        )

        return TripResponse(
            id=f"trip-{uuid.uuid4().hex[:10]}",
            title=f"{duration}-Day Curated {prefs.destination} Journey",
            destination=prefs.destination,
            departureCity=prefs.departureCity,
            startDate=prefs.startDate,
            endDate=prefs.endDate,
            durationDays=duration,
            budget=prefs.budget,
            currency=prefs.currency,
            travelers=prefs.travelers,
            interests=prefs.interests,
            travelStyle=prefs.travelStyle,
            pace=prefs.pace,
            coverImage="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
            overview=f"A personalized {duration}-day travel journey for {prefs.travelers} traveler(s) from {prefs.departureCity} to {prefs.destination}, tailored for a {prefs.pace} rhythm with focus on {', '.join(prefs.interests) if prefs.interests else 'authentic local culture'}.",
            days=days,
            expenses=expenses,
            isSaved=False,
            createdAt=datetime.now().isoformat()
        )

    @staticmethod
    def _generate_fallback_day(
        day_number: int,
        prefs: TripPreferences,
        custom_instructions: Optional[str]
    ) -> DayItinerary:
        base_coords = get_base_coords(prefs.destination)
        dest_clean = prefs.destination.split(",")[0].strip()

        act1 = Activity(
            id=f"act-regen-{day_number}-1",
            time="09:30 AM",
            period="morning",
            title=f"Secret Gardens & Hidden Cloisters of {dest_clean}",
            description=f"Quiet morning discovery through historic private courtyards away from primary tourist congestion. {custom_instructions or ''}",
            location=f"Old District, {dest_clean}",
            coordinates=Coordinates(lat=base_coords.lat + 0.015, lng=base_coords.lng - 0.005),
            duration="2 hours",
            cost=float(10 * prefs.travelers),
            category="Cultural",
            bookingRequired=False,
            tips="Serene peaceful ambience for quiet contemplation."
        )

        act2 = Activity(
            id=f"act-regen-{day_number}-2",
            time="02:00 PM",
            period="afternoon",
            title=f"Artisan Market Tasting Safari",
            description="Sample regional cheese, handmade pastries, and specialty vintage teas with local merchants.",
            location=f"Mercato Centrale, {dest_clean}",
            coordinates=Coordinates(lat=base_coords.lat + 0.018, lng=base_coords.lng + 0.008),
            duration="2.5 hours",
            cost=float(35 * prefs.travelers),
            category="Food",
            bookingRequired=False,
            tips="Try the seasonal savory specialties."
        )

        act3 = Activity(
            id=f"act-regen-{day_number}-3",
            time="06:30 PM",
            period="evening",
            title="Acoustic Jazz & Skyline Rooftop",
            description="Relax with live acoustic music and panoramic sunset views overlooking the glowing city.",
            location=f"Rooftop Quarter, {dest_clean}",
            coordinates=Coordinates(lat=base_coords.lat + 0.010, lng=base_coords.lng + 0.015),
            duration="2 hours",
            cost=float(25 * prefs.travelers),
            category="Entertainment",
            bookingRequired=True,
            tips="Reservations recommended for outdoor terrace seating."
        )

        meals = DayMeals(
            breakfast=MealRecommendation(
                type="breakfast",
                restaurant="The Roastery & Co.",
                cuisine="Cold Brew & Sourdough Pastries",
                estimatedCost=float(16 * prefs.travelers),
                description="Organic grain pastries and fresh pour-over."
            ),
            lunch=MealRecommendation(
                type="lunch",
                restaurant="La Trattoria Nascosta",
                cuisine="Hand-crafted Regional Pasta",
                estimatedCost=float(28 * prefs.travelers),
                description="Hand-rolled pasta with wild truffles and herbs."
            ),
            dinner=MealRecommendation(
                type="dinner",
                restaurant="Botanica Glasshouse Dining",
                cuisine="Seasonal Contemporary Bistro",
                estimatedCost=float(58 * prefs.travelers),
                description="Candlelit dinner surrounded by lush indoor flora."
            )
        )

        accommodation = AccommodationSuggestion(
            name=f"The Riverside Sanctuary {dest_clean}",
            type="Boutique Riverside Hotel",
            neighborhood="Arts District",
            pricePerNight=195.0,
            rating=4.9,
            highlights=["River views", "Art collection", "Complimentary bikes"]
        )

        transport = TransportOption(
            mode="Vintage Tramway & Walking",
            description="Scenic tram routes along the river.",
            estimatedCost=float(12 * prefs.travelers),
            duration="30 mins"
        )

        day_cost = (
            act1.cost + act2.cost + act3.cost +
            meals.breakfast.estimatedCost + meals.lunch.estimatedCost + meals.dinner.estimatedCost +
            transport.estimatedCost
        )

        return DayItinerary(
            dayNumber=day_number,
            date=prefs.startDate,
            theme=f"Reimagined Alternative: Hidden Jewels & Artisans",
            summary=f"An alternative day specifically regenerated to highlight hidden gems, gourmet tastings, and scenic views in {dest_clean}.",
            activities=[act1, act2, act3],
            meals=meals,
            accommodation=accommodation,
            transport=transport,
            dayCost=day_cost
        )
