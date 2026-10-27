from typing import List, Dict, Optional
from fastapi import APIRouter, HTTPException, status
from app.models.itinerary import TripResponse

router = APIRouter(prefix="/api/trips", tags=["Trips"])

# In-memory store fallback for demo & fast testing if Supabase backend direct pool isn't configured
IN_MEMORY_TRIPS: Dict[str, dict] = {}

@router.get("", response_model=List[dict])
async def list_trips(user_id: Optional[str] = None):
    """
    List all trips, optionally filtered by user_id.
    """
    trips = list(IN_MEMORY_TRIPS.values())
    if user_id:
        trips = [t for t in trips if t.get("userId") == user_id]
    return trips

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_trip(trip: TripResponse):
    """
    Save or create a new trip itinerary.
    """
    trip_data = trip.model_dump()
    trip_data["isSaved"] = True
    IN_MEMORY_TRIPS[trip.id] = trip_data
    return {"status": "success", "trip": trip_data}

@router.get("/{trip_id}", response_model=dict)
async def get_trip(trip_id: str):
    """
    Retrieve a trip by its ID.
    """
    if trip_id not in IN_MEMORY_TRIPS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )
    return IN_MEMORY_TRIPS[trip_id]

@router.put("/{trip_id}", response_model=dict)
async def update_trip(trip_id: str, trip: TripResponse):
    """
    Update an existing trip.
    """
    trip_data = trip.model_dump()
    trip_data["isSaved"] = True
    IN_MEMORY_TRIPS[trip_id] = trip_data
    return {"status": "success", "trip": trip_data}

@router.delete("/{trip_id}", status_code=status.HTTP_200_OK)
async def delete_trip(trip_id: str):
    """
    Delete a trip by its ID.
    """
    if trip_id in IN_MEMORY_TRIPS:
        del IN_MEMORY_TRIPS[trip_id]
    return {"status": "success", "message": f"Trip {trip_id} removed"}
