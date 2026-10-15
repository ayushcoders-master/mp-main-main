import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { IEmergencyService, ICrimeData, IRouteAlternative } from '../types.ts';
import {
  Shield,
  Cross,
  AlertTriangle,
  Layers,
  MapPin,
  Navigation,
  Check,
  Compass
} from 'lucide-react';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character] || character);
}

interface SafetyMapProps {
  center: [number, number];
  zoom?: number;
  locationName: string;
  emergencyServices?: IEmergencyService[];
  crimeData?: ICrimeData[];
  routes?: IRouteAlternative[];
  selectedRouteId?: string;
  onSelectRoute?: (id: string) => void;
  showLocationMarker?: boolean;
  showSafeZones?: boolean;
  className?: string;
}

export const SafetyMap: React.FC<SafetyMapProps> = ({
  center,
  zoom = 13,
  locationName,
  emergencyServices = [],
  crimeData = [],
  routes = [],
  selectedRouteId,
  onSelectRoute,
  showLocationMarker = true,
  showSafeZones = true,
  className = 'h-[500px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{
    tourist?: L.LayerGroup;
    police?: L.LayerGroup;
    hospitals?: L.LayerGroup;
    crime?: L.LayerGroup;
    zones?: L.LayerGroup;
    routes?: L.LayerGroup;
  }>({});

  // Layer Visibility State
  const [layers, setLayers] = useState({
    touristLocation: showLocationMarker,
    policeStations: true,
    hospitals: true,
    crimeHotspots: true,
    safeZones: showSafeZones,
    routes: true
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true
      });

      // OpenStreetMap Tiles with subtle dark/standard styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      layersGroupRef.current = {
        tourist: L.layerGroup().addTo(map),
        police: L.layerGroup().addTo(map),
        hospitals: L.layerGroup().addTo(map),
        crime: L.layerGroup().addTo(map),
        zones: L.layerGroup().addTo(map),
        routes: L.layerGroup().addTo(map)
      };

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when props change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center[0], center[1], zoom]);

  // Render Map Markers and Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const groups = layersGroupRef.current;
    if (!map || !groups.tourist) return;

    // Clear all layers
    groups.tourist.clearLayers();
    groups.police?.clearLayers();
    groups.hospitals?.clearLayers();
    groups.crime?.clearLayers();
    groups.zones?.clearLayers();
    groups.routes?.clearLayers();

    // 1. Tourist Center Marker
    if (layers.touristLocation) {
      const touristIcon = L.divIcon({
        className: 'custom-tourist-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-cyan-500/40 animate-ping"></span>
            <div class="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const touristMarker = L.marker(center, { icon: touristIcon }).addTo(groups.tourist);
      touristMarker.bindPopup(`
        <div class="p-2 text-slate-800 font-sans min-w-[200px]">
          <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-cyan-100 text-cyan-800 rounded mb-1">Target Destination</span>
          <h4 class="font-bold text-sm text-slate-900">${locationName}</h4>
          <p class="text-xs text-slate-600 mt-1">Evaluated Safety Zone Center</p>
          <div class="text-[11px] text-slate-500 mt-2 font-mono">Coordinates: ${center[0].toFixed(4)}, ${center[1].toFixed(4)}</div>
        </div>
      `);
    }

    // 2. Emergency Services (Police & Hospitals)
    emergencyServices.forEach((svc) => {
      if (svc.type === 'police' && layers.policeStations && groups.police) {
        const policeIcon = L.divIcon({
          className: 'custom-police-marker',
          html: `
            <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([svc.latitude, svc.longitude], { icon: policeIcon }).addTo(groups.police);
        marker.bindPopup(`
          <div class="p-2 text-slate-800 font-sans min-w-[220px]">
            <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-blue-100 text-blue-800 rounded mb-1">Police Station</span>
            <h4 class="font-bold text-sm text-slate-900">${svc.name}</h4>
            <p class="text-xs text-slate-600 mt-1">${svc.address || 'Central Precinct'}</p>
            <div class="mt-2 pt-1 border-t border-slate-200 text-xs">
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Distance:</span> <strong class="text-slate-800">${svc.distanceKm || '0.9'} km</strong></div>
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Emergency Call:</span> <strong class="text-blue-600 font-mono">${svc.contact}</strong></div>
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Availability:</span> <span class="text-emerald-600 font-semibold">${svc.emergencyAvailability || '24/7 Rapid Patrol'}</span></div>
            </div>
          </div>
        `);
      }

      if (svc.type === 'hospital' && layers.hospitals && groups.hospitals) {
        const hospitalIcon = L.divIcon({
          className: 'custom-hospital-marker',
          html: `
            <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/></svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([svc.latitude, svc.longitude], { icon: hospitalIcon }).addTo(groups.hospitals);
        marker.bindPopup(`
          <div class="p-2 text-slate-800 font-sans min-w-[220px]">
            <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 rounded mb-1">Hospital / Trauma</span>
            <h4 class="font-bold text-sm text-slate-900">${svc.name}</h4>
            <p class="text-xs text-slate-600 mt-1">${svc.address || 'Medical Ward'}</p>
            <div class="mt-2 pt-1 border-t border-slate-200 text-xs">
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Distance:</span> <strong class="text-slate-800">${svc.distanceKm || '1.4'} km</strong></div>
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Ambulance ER:</span> <strong class="text-emerald-700 font-mono">${svc.contact}</strong></div>
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Facility:</span> <span class="text-emerald-600 font-semibold">${svc.emergencyAvailability || '24/7 ER Care'}</span></div>
            </div>
          </div>
        `);
      }
    });

    // 3. Crime Hotspots
    if (layers.crimeHotspots && groups.crime) {
      crimeData.forEach((crime) => {
        const crimeIcon = L.divIcon({
          className: 'custom-crime-marker',
          html: `
            <div class="w-6 h-6 rounded-full bg-rose-600/90 border-2 border-white shadow-md flex items-center justify-center text-white hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        // Add danger radius circle
        L.circle([crime.latitude, crime.longitude], {
          radius: 260,
          color: '#e11d48',
          fillColor: '#f43f5e',
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '3, 4'
        }).addTo(groups.crime);

        const marker = L.marker([crime.latitude, crime.longitude], { icon: crimeIcon }).addTo(groups.crime);
        marker.bindPopup(`
          <div class="p-2 text-slate-800 font-sans min-w-[220px]">
            <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-rose-100 text-rose-800 rounded mb-1">Documented Crime Incident</span>
            <h4 class="font-bold text-sm text-slate-900">${crime.crimeType}</h4>
            <p class="text-xs text-slate-600 mt-1">${crime.description}</p>
            <div class="mt-2 pt-1 border-t border-slate-200 text-xs">
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Severity:</span> <strong class="text-rose-600 font-mono">${crime.severity}/10 Severity</strong></div>
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Logged Time:</span> <span class="text-slate-700">${crime.date} at ${crime.time}</span></div>
              <div class="flex justify-between py-0.5"><span class="text-slate-500">Recommendation:</span> <span class="text-amber-700 font-medium">Keep alert, avoid evening transit</span></div>
            </div>
          </div>
        `);
      });
    }

    // 4. Safer Areas & Zones
    if (layers.safeZones && groups.zones) {
      // Designated safe tourist corridor circle around center
      L.circle(center, {
        radius: 650,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.08,
        weight: 2
      }).addTo(groups.zones).bindPopup(`
        <div class="p-1 text-slate-800 font-sans">
          <strong class="text-emerald-700 text-xs block">Active Surveillance Zone</strong>
          <span class="text-[11px] text-slate-600">Continuous municipal lighting & active tourist police patrol.</span>
        </div>
      `);
    }

    // 5. Routes Polylines
    if (layers.routes && groups.routes && routes.length > 0) {
      const routeColors = ['#0f766e', '#2563eb', '#d97706'];
      const routeLines: L.Polyline[] = [];
      routes.forEach((route, index) => {
        const isSelected = route.id === selectedRouteId;
        const color = routeColors[index % routeColors.length];
        const weight = isSelected ? 6 : 4;
        const opacity = isSelected ? 0.95 : 0.65;

        const polyline = L.polyline(route.waypoints, {
          color,
          weight,
          opacity
        }).addTo(groups.routes!);
        routeLines.push(polyline);

        polyline.on('click', () => {
          if (onSelectRoute) onSelectRoute(route.id);
        });

        polyline.bindPopup(`
          <div class="p-2 text-slate-800 font-sans min-w-[200px]">
            <span class="inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-slate-100 text-slate-800 rounded mb-1">Driving route option</span>
            <h4 class="font-bold text-sm text-slate-900">${escapeHtml(route.name)}</h4>
            <div class="mt-1 text-xs text-slate-600">
              <div>Distance: <strong>${route.distanceKm} km</strong> | Time: <strong>${route.durationMinutes} min</strong></div>
              <div>Roads: <strong>${escapeHtml(route.roadNames.join(', ') || 'Street names unavailable')}</strong></div>
            </div>
          </div>
        `);
      });

      const firstRoute = routes[0]?.waypoints;
      if (firstRoute && firstRoute.length > 1) {
        L.circleMarker(firstRoute[0], { radius: 7, color: '#064e3b', fillColor: '#34d399', fillOpacity: 1, weight: 2 })
          .addTo(groups.routes).bindPopup('Route start');
        L.circleMarker(firstRoute[firstRoute.length - 1], { radius: 7, color: '#1e3a8a', fillColor: '#60a5fa', fillOpacity: 1, weight: 2 })
          .addTo(groups.routes).bindPopup('Route destination');
      }

      if (routeLines.length > 0) {
        const routeBounds = L.featureGroup(routeLines).getBounds();
        if (routeBounds.isValid()) map.fitBounds(routeBounds, { padding: [32, 32], maxZoom: 14 });
      }
    }
  }, [center, layers, emergencyServices, crimeData, routes, selectedRouteId]);

  return (
    <div id="safety-map-container" className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
      {/* Map Surface */}
      <div ref={mapContainerRef} className={`w-full ${className} z-0`} />

      {/* Interactive Layer Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-xl max-w-xs text-xs">
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-700 font-semibold text-slate-200">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Map Layers</span>
        </div>

        <div className="space-y-1.5">
          {showLocationMarker && <label className="flex items-center justify-between gap-3 text-slate-300 hover:text-white cursor-pointer select-none">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Tourist Destination
            </span>
            <input
              type="checkbox"
              checked={layers.touristLocation}
              onChange={(e) => setLayers({ ...layers, touristLocation: e.target.checked })}
              className="rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0"
            />
          </label>}

          {emergencyServices.some((service) => service.type === 'police') && <label className="flex items-center justify-between gap-3 text-slate-300 hover:text-white cursor-pointer select-none">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Police Stations
            </span>
            <input
              type="checkbox"
              checked={layers.policeStations}
              onChange={(e) => setLayers({ ...layers, policeStations: e.target.checked })}
              className="rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-0"
            />
          </label>}

          {emergencyServices.some((service) => service.type === 'hospital') && <label className="flex items-center justify-between gap-3 text-slate-300 hover:text-white cursor-pointer select-none">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Hospitals & ER
            </span>
            <input
              type="checkbox"
              checked={layers.hospitals}
              onChange={(e) => setLayers({ ...layers, hospitals: e.target.checked })}
              className="rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-0"
            />
          </label>}

          {crimeData.length > 0 && <label className="flex items-center justify-between gap-3 text-slate-300 hover:text-white cursor-pointer select-none">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Crime Hotspots
            </span>
            <input
              type="checkbox"
              checked={layers.crimeHotspots}
              onChange={(e) => setLayers({ ...layers, crimeHotspots: e.target.checked })}
              className="rounded bg-slate-800 border-slate-600 text-rose-500 focus:ring-0"
            />
          </label>}

          {showSafeZones && <label className="flex items-center justify-between gap-3 text-slate-300 hover:text-white cursor-pointer select-none">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/40 border border-emerald-400" />
              Safe Zones
            </span>
            <input
              type="checkbox"
              checked={layers.safeZones}
              onChange={(e) => setLayers({ ...layers, safeZones: e.target.checked })}
              className="rounded bg-slate-800 border-slate-600 text-emerald-400 focus:ring-0"
            />
          </label>}

          {routes.length > 0 && (
            <label className="flex items-center justify-between gap-3 text-slate-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-1 rounded bg-emerald-400" />
                Route Alternatives
              </span>
              <input
                type="checkbox"
                checked={layers.routes}
                onChange={(e) => setLayers({ ...layers, routes: e.target.checked })}
                className="rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-0"
              />
            </label>
          )}
        </div>
      </div>

      {/* Floating Center Badge */}
      <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-lg text-[11px] text-slate-300 flex items-center gap-2">
        <Compass className="w-3.5 h-3.5 text-cyan-400" />
        <span>Focus: <strong>{locationName}</strong></span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400 font-mono">OpenStreetMap Layer</span>
      </div>
    </div>
  );
};
