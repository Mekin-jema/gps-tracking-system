"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Vehicle } from "@/types/vehicle";

interface MapProps {
  vehicles: Vehicle[];
}

export default function Map({ vehicles }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center:[38.7613, 9.0108],
      zoom: 30,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Maintain a reference to markers
    const markers: maplibregl.Marker[] = [];

    // Remove old markers
    markers.forEach(marker => marker.remove());
    markers.length = 0;

    // Add new markers
    vehicles.forEach(vehicle => {
      const marker = new maplibregl.Marker()
        .setLngLat([vehicle.location.lng, vehicle.location.lat])
        .setPopup(new maplibregl.Popup().setText(vehicle.plateNumber))
        .addTo(mapRef.current!);
      markers.push(marker);
    });
  }, [vehicles]);

  

  return(
    <>
      <h1 className="text-2xl font-bold text-center mb-4">Vehicle Map</h1>
      <p className="text-center mb-4">Click on a marker to see the vehicle's plate number.</p>
      <div ref={mapContainer} className="w-full h-screen " />
    </>
  )
}
