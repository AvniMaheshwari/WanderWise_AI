from fastapi import APIRouter, HTTPException, status
from app.models.itinerary import (
    TripPreferences,
    TripResponse,
    DayItinerary,
    RegenerateDayRequest,
)
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/itinerary", tags=["Itinerary"])

@router.post("/generate", response_model=dict, status_code=status.HTTP_200_OK)
async def generate_itinerary(preferences: TripPreferences):
    """
    Generate a full personalized itinerary using AI with strict Pydantic validation.
    """
    try:
        trip: TripResponse = await AIService.generate_itinerary(preferences)
        return {"status": "success", "trip": trip.model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate itinerary: {str(e)}"
        )

@router.post("/regenerate-day", response_model=dict, status_code=status.HTTP_200_OK)
async def regenerate_day(request: RegenerateDayRequest):
    """
    Regenerate a specific day of an itinerary with optional custom instructions.
    """
    try:
        day: DayItinerary = await AIService.regenerate_single_day(
            trip_id=request.trip_id,
            day_number=request.day_number,
            prefs=request.preferences,
            custom_instructions=request.custom_instructions
        )
        return {"status": "success", "day": day.model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to regenerate day: {str(e)}"
        )
