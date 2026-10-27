import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { FeatureGrid } from './components/FeatureGrid';
import { TripBuilderModal } from './components/TripBuilder/TripBuilderModal';
import { ItineraryHeader } from './components/Itinerary/ItineraryHeader';
import { DayCard } from './components/Itinerary/DayCard';
import { ActivityEditModal } from './components/Itinerary/ActivityEditModal';
import { RegenerateDayModal } from './components/Itinerary/RegenerateDayModal';
import { BudgetBreakdown } from './components/Budget/BudgetBreakdown';
import { ItineraryMap } from './components/Map/ItineraryMap';
import { AuthModal } from './components/Auth/AuthModal';
import { DashboardView } from './components/Dashboard/DashboardView';
import { AIGeneratingLoader } from './components/UI/AIGeneratingLoader';
import { DemoVideoModal } from './components/UI/DemoVideoModal';
import { ToastContainer, ToastMessage } from './components/UI/Toast';
import { SAMPLE_TRIPS } from './services/mockData';
import { tripService } from './services/supabase';
import { generateItineraryAPI, regenerateDayAPI, checkBackendHealth } from './services/api';
import { Trip, TripPreferences, Activity, DayItinerary, ExpenseBreakdown } from './types/itinerary';
import { useAuth } from './context/AuthContext';

export const App: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'landing' | 'planner' | 'itinerary' | 'saved' | 'map'>('landing');
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(SAMPLE_TRIPS[0]);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [selectedDayTab, setSelectedDayTab] = useState<number | 'all'>('all');

  // Modals & Loaders
  const [isTripBuilderOpen, setIsTripBuilderOpen] = useState(false);
  const [builderInitialDestination, setBuilderInitialDestination] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const githubUrl = import.meta.env.VITE_GITHUB_REPO_URL || 'https://github.com/your-username/wanderwise-ai';
  const demoVideoUrl = import.meta.env.VITE_DEMO_VIDEO_URL || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  // Edit Activity modal state
  const [activityModalState, setActivityModalState] = useState<{
    isOpen: boolean;
    activity: Activity | null;
    dayNumber: number;
  }>({
    isOpen: false,
    activity: null,
    dayNumber: 1,
  });

  // Regenerate Day modal state
  const [regenerateModalState, setRegenerateModalState] = useState<{
    isOpen: boolean;
    dayNumber: number;
  }>({
    isOpen: false,
    dayNumber: 1,
  });
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    // Check backend health
    checkBackendHealth().then((health) => {
      setBackendOnline(Boolean(health && health.status === 'ok'));
    });

    // Load trips from Supabase / local demo store
    loadTrips();
  }, [user]);

  const loadTrips = async () => {
    const trips = await tripService.fetchTrips(user?.id);
    setSavedTrips(trips);
  };

  // Handle Generate Itinerary
  const handleGenerateTrip = async (prefs: TripPreferences) => {
    setIsTripBuilderOpen(false);
    setIsGenerating(true);

    try {
      const { trip, source } = await generateItineraryAPI(prefs);
      setCurrentTrip(trip);
      setActiveTab('itinerary');
      setSelectedDayTab('all');

      addToast(
        'success',
        'Itinerary Generated!',
        source === 'backend'
          ? 'FastAPI AI engine synthesized your custom itinerary.'
          : 'Synthesized with WanderWise smart planner engine.'
      );
    } catch (err: any) {
      addToast('error', 'Generation Error', err.message || 'Failed to generate itinerary.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Save Trip to Supabase
  const handleSaveTrip = async () => {
    if (!currentTrip) return;
    setIsSaving(true);

    try {
      const res = await tripService.saveTrip(currentTrip, user?.id);
      if (res.success) {
        setCurrentTrip(res.trip);
        await loadTrips();
        addToast(
          'success',
          'Trip Saved Successfully!',
          'Your itinerary is stored in Supabase with RLS protection.'
        );
      } else {
        addToast('error', 'Failed to save', res.error);
      }
    } catch (e: any) {
      addToast('error', 'Save Failed', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Trip
  const handleDeleteTrip = async (tripId: string) => {
    await tripService.deleteTrip(tripId);
    await loadTrips();
    if (currentTrip?.id === tripId) {
      setCurrentTrip(savedTrips.find((t) => t.id !== tripId) || null);
    }
    addToast('info', 'Trip Removed', 'The trip was removed from your saved list.');
  };

  // Activity Edit/Add Handlers
  const handleOpenAddActivity = (dayNumber: number) => {
    setActivityModalState({
      isOpen: true,
      activity: null,
      dayNumber,
    });
  };

  const handleOpenEditActivity = (activity: Activity, dayNumber: number) => {
    setActivityModalState({
      isOpen: true,
      activity,
      dayNumber,
    });
  };

  const handleSaveActivity = (activity: Activity) => {
    if (!currentTrip) return;
    const { dayNumber } = activityModalState;

    const updatedDays = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;

      const existingIdx = day.activities.findIndex((a) => a.id === activity.id);
      let newActivities: Activity[];
      if (existingIdx >= 0) {
        newActivities = [...day.activities];
        newActivities[existingIdx] = activity;
      } else {
        newActivities = [...day.activities, activity];
      }

      // Recalculate day cost
      const newDayCost = newActivities.reduce((sum, a) => sum + a.cost, 0) +
        (day.meals.breakfast.estimatedCost + day.meals.lunch.estimatedCost + day.meals.dinner.estimatedCost) +
        day.transport.estimatedCost;

      return {
        ...day,
        activities: newActivities,
        dayCost: newDayCost,
      };
    });

    // Recalculate trip expenses
    const updatedExpenses = recalculateExpenses(updatedDays, currentTrip);

    setCurrentTrip({
      ...currentTrip,
      days: updatedDays,
      expenses: updatedExpenses,
    });

    setActivityModalState({ isOpen: false, activity: null, dayNumber: 1 });
    addToast('success', 'Activity Updated', `Updated schedule for Day ${dayNumber}`);
  };

  const handleDeleteActivity = (activityId: string, dayNumber: number) => {
    if (!currentTrip) return;

    const updatedDays = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const filtered = day.activities.filter((a) => a.id !== activityId);
      const newDayCost = filtered.reduce((sum, a) => sum + a.cost, 0) +
        (day.meals.breakfast.estimatedCost + day.meals.lunch.estimatedCost + day.meals.dinner.estimatedCost) +
        day.transport.estimatedCost;

      return {
        ...day,
        activities: filtered,
        dayCost: newDayCost,
      };
    });

    const updatedExpenses = recalculateExpenses(updatedDays, currentTrip);

    setCurrentTrip({
      ...currentTrip,
      days: updatedDays,
      expenses: updatedExpenses,
    });

    addToast('info', 'Activity Removed', `Deleted activity from Day ${dayNumber}`);
  };

  // Regenerate selected day
  const handleRegenerateDay = async (dayNumber: number, customInstructions: string) => {
    if (!currentTrip) return;
    setIsRegeneratingDay(true);

    try {
      const preferences: TripPreferences = {
        destination: currentTrip.destination,
        departureCity: currentTrip.departureCity,
        startDate: currentTrip.startDate,
        endDate: currentTrip.endDate,
        budget: currentTrip.budget,
        currency: currentTrip.currency,
        travelers: currentTrip.travelers,
        interests: currentTrip.interests,
        travelStyle: currentTrip.travelStyle,
        pace: currentTrip.pace,
      };

      const newDay = await regenerateDayAPI(currentTrip.id, dayNumber, preferences, customInstructions);

      const updatedDays = currentTrip.days.map((d) => (d.dayNumber === dayNumber ? newDay : d));
      const updatedExpenses = recalculateExpenses(updatedDays, currentTrip);

      setCurrentTrip({
        ...currentTrip,
        days: updatedDays,
        expenses: updatedExpenses,
      });

      setRegenerateModalState({ isOpen: false, dayNumber: 1 });
      addToast('success', `Day ${dayNumber} Regenerated!`, 'AI generated fresh activities and dining recommendations.');
    } catch (err: any) {
      addToast('error', 'Regeneration Failed', err.message);
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  const recalculateExpenses = (days: DayItinerary[], trip: Trip): ExpenseBreakdown => {
    const actCost = days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + a.cost, 0), 0);
    const foodCost = days.reduce((sum, d) => sum + (d.meals.breakfast.estimatedCost + d.meals.lunch.estimatedCost + d.meals.dinner.estimatedCost), 0);
    const transCost = days.reduce((sum, d) => sum + d.transport.estimatedCost, 0);
    const accomCost = Math.round(days[0]?.accommodation?.pricePerNight * trip.durationDays || 0);
    const miscCost = Math.round(trip.budget * 0.05);

    return {
      accommodation: accomCost,
      activities: actCost,
      food: foodCost,
      transport: transCost,
      miscellaneous: miscCost,
      total: accomCost + actCost + foodCost + transCost + miscCost,
      currency: trip.currency,
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={() => setIsAuthModalOpen(true)}
        openDemoVideoModal={() => setIsDemoVideoOpen(true)}
        backendOnline={backendOnline}
        githubUrl={githubUrl}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Landing Page */}
        {activeTab === 'landing' && (
          <>
            <HeroSection
              onStartPlanning={(preset) => {
                setBuilderInitialDestination(preset || '');
                setIsTripBuilderOpen(true);
              }}
              onPreviewSampleTrip={() => {
                setCurrentTrip(SAMPLE_TRIPS[0]);
                setActiveTab('itinerary');
              }}
              onOpenDemoVideo={() => setIsDemoVideoOpen(true)}
            />
            <FeatureGrid />
          </>
        )}

        {/* Saved Trips Dashboard */}
        {activeTab === 'saved' && (
          <DashboardView
            trips={savedTrips}
            onSelectTrip={(trip) => {
              setCurrentTrip(trip);
              setActiveTab('itinerary');
            }}
            onDeleteTrip={handleDeleteTrip}
            onNewTrip={() => {
              setBuilderInitialDestination('');
              setIsTripBuilderOpen(true);
            }}
          />
        )}

        {/* Planner tab trigger or fallback */}
        {activeTab === 'planner' && (
          <div className="max-w-2xl mx-auto py-16 px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Trip Planner Wizard</h2>
            <p className="text-sm text-slate-400 mb-6">
              Launch our AI builder modal to configure your destination, budget, style, and travel pace.
            </p>
            <button
              onClick={() => setIsTripBuilderOpen(true)}
              className="px-6 py-3 rounded-xl font-bold text-sm text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 shadow-glow-cyan"
            >
              Open Trip Configuration
            </button>
          </div>
        )}

        {/* Interactive Map View */}
        {activeTab === 'map' && currentTrip && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Full Route Map — {currentTrip.destination}</h2>
                <p className="text-xs text-slate-400">All planned activities, daily corridors & coordinates</p>
              </div>
              <button
                onClick={() => setActiveTab('itinerary')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-navy-850 hover:bg-navy-800 border border-slate-700"
              >
                Back to Daily Itinerary
              </button>
            </div>
            <ItineraryMap days={currentTrip.days} destination={currentTrip.destination} />
          </div>
        )}

        {/* Itinerary View */}
        {activeTab === 'itinerary' && currentTrip && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <ItineraryHeader
              trip={currentTrip}
              onSaveTrip={handleSaveTrip}
              isSaving={isSaving}
              onEditPreferences={() => setIsTripBuilderOpen(true)}
              onOpenMap={() => setActiveTab('map')}
              selectedDayTab={selectedDayTab}
              setSelectedDayTab={setSelectedDayTab}
            />

            {/* Budget Breakdown Summary */}
            <BudgetBreakdown
              budget={currentTrip.budget}
              expenses={currentTrip.expenses}
              currency={currentTrip.currency}
            />

            {/* Daily Cards Section */}
            <div className="space-y-6">
              {currentTrip.days
                .filter((day) => selectedDayTab === 'all' || day.dayNumber === selectedDayTab)
                .map((day) => (
                  <DayCard
                    key={day.dayNumber}
                    day={day}
                    destination={currentTrip.destination}
                    onEditActivity={handleOpenEditActivity}
                    onDeleteActivity={handleDeleteActivity}
                    onAddActivity={handleOpenAddActivity}
                    onOpenRegenerate={(dayNum) =>
                      setRegenerateModalState({ isOpen: true, dayNumber: dayNum })
                    }
                    isRegeneratingThisDay={isRegeneratingDay && regenerateModalState.dayNumber === day.dayNumber}
                  />
                ))}
            </div>

            {/* Embedded Map Section */}
            <div className="mt-12">
              <ItineraryMap days={currentTrip.days} destination={currentTrip.destination} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenDemoVideo={() => setIsDemoVideoOpen(true)}
        githubUrl={githubUrl}
      />

      {/* Demo Video Modal */}
      <DemoVideoModal
        isOpen={isDemoVideoOpen}
        onClose={() => setIsDemoVideoOpen(false)}
        videoUrl={demoVideoUrl}
        githubUrl={githubUrl}
      />

      {/* Modals */}
      <TripBuilderModal
        isOpen={isTripBuilderOpen}
        onClose={() => setIsTripBuilderOpen(false)}
        onSubmit={handleGenerateTrip}
        initialDestination={builderInitialDestination}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          addToast('success', 'Logged In', 'Account session updated.');
          loadTrips();
        }}
      />

      <ActivityEditModal
        isOpen={activityModalState.isOpen}
        onClose={() => setActivityModalState({ isOpen: false, activity: null, dayNumber: 1 })}
        onSave={handleSaveActivity}
        initialActivity={activityModalState.activity}
        dayNumber={activityModalState.dayNumber}
      />

      <RegenerateDayModal
        isOpen={regenerateModalState.isOpen}
        onClose={() => setRegenerateModalState({ isOpen: false, dayNumber: 1 })}
        dayNumber={regenerateModalState.dayNumber}
        destination={currentTrip?.destination || 'Destination'}
        onConfirm={handleRegenerateDay}
        isRegenerating={isRegeneratingDay}
      />

      {/* Fullscreen AI Generating Loader */}
      {isGenerating && (
        <AIGeneratingLoader
          destination={builderInitialDestination || 'Your Selected Destination'}
          travelers={2}
          durationDays={4}
        />
      )}

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
