import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Clock, DollarSign, Calendar, Layers } from 'lucide-react';
import { DayItinerary, Activity } from '../../types/itinerary';

// Fix Leaflet's default icon path issue in Vite
const createCustomMarker = (number: number, period: string) => {
  const bgColors: Record<string, string> = {
    morning: '#F59E0B',   // amber
    afternoon: '#00F0FF', // electric cyan
    evening: '#6366F1',   // indigo
  };

  const color = bgColors[period] || '#00F0FF';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: #0B0F19;
        border: 2px solid ${color};
        box-shadow: 0 0 12px ${color}80;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        color: #ffffff;
      ">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface ItineraryMapProps {
  days: DayItinerary[];
  destination: string;
}

export const ItineraryMap: React.FC<ItineraryMapProps> = ({ days, destination }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | 'all'>('all');

  // Filter activities based on selected day
  const displayedActivities = useMemo(() => {
    if (selectedDayIndex === 'all') {
      return days.flatMap((d) => d.activities.map((a) => ({ ...a, dayNumber: d.dayNumber })));
    }
    const targetDay = days.find((d) => d.dayNumber === selectedDayIndex);
    return targetDay ? targetDay.activities.map((a) => ({ ...a, dayNumber: targetDay.dayNumber })) : [];
  }, [days, selectedDayIndex]);

  // Center coordinate calculation
  const centerCoord = useMemo<[number, number]>(() => {
    if (displayedActivities.length > 0 && displayedActivities[0].coordinates?.lat) {
      return [displayedActivities[0].coordinates.lat, displayedActivities[0].coordinates.lng];
    }
    return [35.0116, 135.7681]; // Default Kyoto
  }, [displayedActivities]);

  // Polyline coordinates for routing paths
  const routePolyline = useMemo<[number, number][]>(() => {
    return displayedActivities
      .filter((a) => a.coordinates && a.coordinates.lat && a.coordinates.lng)
      .map((a) => [a.coordinates.lat, a.coordinates.lng]);
  }, [displayedActivities]);

  return (
    <div className="glass-panel rounded-2xl border border-cyan-500/25 p-5 sm:p-7 mb-8 shadow-glow-card text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Interactive Geocoded Route Map</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real GPS coordinate pins and transit corridors across {destination}
          </p>
        </div>

        {/* Day selection pill filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1 font-semibold">
            <Layers className="w-3.5 h-3.5" /> Day:
          </span>
          <button
            onClick={() => setSelectedDayIndex('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedDayIndex === 'all'
                ? 'bg-cyan-400 text-navy-950 font-bold shadow-glow-cyan-sm'
                : 'bg-navy-850 text-slate-300 border border-slate-700 hover:border-slate-500'
            }`}
          >
            All
          </button>
          {days.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDayIndex(d.dayNumber)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedDayIndex === d.dayNumber
                  ? 'bg-cyan-400 text-navy-950 font-bold shadow-glow-cyan-sm'
                  : 'bg-navy-850 text-slate-300 border border-slate-700 hover:border-slate-500'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[420px] sm:h-[480px] rounded-xl overflow-hidden border border-slate-700/80 relative">
        <MapContainer
          key={`${centerCoord[0]}-${centerCoord[1]}-${selectedDayIndex}`}
          center={centerCoord}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {/* CartoDB Dark Matter tiles or OpenStreetMap with dark CSS filter */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Polyline Route */}
          {routePolyline.length > 1 && (
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: '#00F0FF',
                weight: 3,
                opacity: 0.75,
                dashArray: '6, 8',
              }}
            />
          )}

          {/* Markers */}
          {displayedActivities.map((act, index) => {
            if (!act.coordinates?.lat || !act.coordinates?.lng) return null;
            return (
              <Marker
                key={act.id}
                position={[act.coordinates.lat, act.coordinates.lng]}
                icon={createCustomMarker(index + 1, act.period)}
              >
                <Popup className="wanderwise-popup">
                  <div className="text-left p-1 min-w-[200px]">
                    <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase mb-1">
                      <span>Day {(act as any).dayNumber || 1} • {act.period}</span>
                      <span className="text-emerald-400">{act.cost === 0 ? 'Free' : `$${act.cost}`}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{act.title}</h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mb-1.5">{act.description}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-cyan-400" /> {act.time} ({act.duration})
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] p-2.5 rounded-xl bg-navy-950/90 border border-slate-700/80 backdrop-blur-md text-[11px] flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Morning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Afternoon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span className="text-slate-300">Evening</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
            <Navigation className="w-3 h-3" />
            <span>Path corridor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
