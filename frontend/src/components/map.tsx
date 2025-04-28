"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Vehicle } from "@/types/vehicle";

interface MapProps {
  vehicles: Vehicle[];
}

interface DeliveryMarker {
  id: string;
  marker: maplibregl.Marker;
}

export default function Map({ vehicles }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const deliveryMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [38.7613, 9.0108],
      zoom: 12, // Reduced from 30 to more reasonable zoom level
    });

    mapRef.current = map;

    map.on("load", () => {
      setIsMapLoaded(true);
      // Initialize any map-dependent functionality here
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update vehicle markers
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    vehicles.forEach(vehicle => {
      const marker = new maplibregl.Marker()
        .setLngLat([vehicle.location.lng, vehicle.location.lat])
        .setPopup(new maplibregl.Popup().setText(vehicle.plateNumber))
        .addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [vehicles, isMapLoaded]);

  // Delivery tracking functions
  const updateDeliveryPosition = (deliveryId: string, lngLat: [number, number]) => {
    if (!mapRef.current) return;

    const deliveryMarkers = deliveryMarkersRef.current;

    if (!deliveryMarkers[deliveryId]) {
      const el = document.createElement('div');
      el.className = 'delivery-marker';
      el.innerHTML = '🚚';
      
      deliveryMarkers[deliveryId] = new maplibregl.Marker(el)
        .setLngLat(lngLat)
        .addTo(mapRef.current);
    } else {
      deliveryMarkers[deliveryId].setLngLat(lngLat);
    }
    
    // Center map on the delivery person
    mapRef.current.flyTo({ center: lngLat });
  };

  const showRoute = async (start: [number, number], end: [number, number]) => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing route
    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      
      if (data.routes?.length) {
        const route = data.routes[0].geometry;
        
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route
          }
        });
        
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4
          }
        });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Example usage - would be triggered by some event or prop change
  useEffect(() => {
    if (!isMapLoaded) return;

    // Simulate delivery tracking
    const interval = setInterval(() => {
      const fakeUpdate = {
        deliveryId: 'driver1',
        lngLat: [
          38.7613 + (Math.random() * 0.01 - 0.005), 
          9.0108 + (Math.random() * 0.01 - 0.005)
        ] as [number, number]
      };
      updateDeliveryPosition(fakeUpdate.deliveryId, fakeUpdate.lngLat);
    }, 2000);

    return () => clearInterval(interval);
  }, [isMapLoaded]);

  return (
    <div className="relative w-full h-full">
      <h1 className="text-2xl font-bold text-center mb-4">Vehicle Map</h1>
      <p className="text-center mb-4">Click on a marker to see the vehicle's plate number.</p>
      <div 
        ref={mapContainer} 
        className="w-full h-[calc(100%-80px)] absolute inset-0 z-[1000]" 
      />
    </div>
  );
}