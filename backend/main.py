import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import itinerary, trips

app = FastAPI(
    title="WanderWise AI — Travel Itinerary API",
    description="Full-stack AI Travel Planner backend providing structured itinerary generation, day regeneration, and CRUD operations.",
    version="1.0.0"
)

# CORS configuration allowing React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(itinerary.router)
app.include_router(trips.router)

@app.get("/")
async def root():
    return {
        "name": "WanderWise AI Backend",
        "status": "online",
        "docs": "/docs",
        "ai_configured": settings.is_ai_configured,
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "aiProvider": "Google Gemini (Structured Output)" if settings.is_ai_configured else "Intelligent Fallback Engine",
        "isAiConfigured": settings.is_ai_configured,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
