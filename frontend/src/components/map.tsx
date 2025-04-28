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
  const mapRef = useRef<maplibregl.Map>();

  useEffect(() => {
    if (!mapContainer.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [38.74, 9.03],
      zoom: 12,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old markers (optional if you refresh often)
    mapRef.current.eachLayer(layer => {
      if (layer.id.startsWith('marker-')) {
        mapRef.current!.removeLayer(layer.id);
      }
    });

    // Add new markers
    vehicles.forEach(vehicle => {
      new maplibregl.Marker()
        .setLngLat([vehicle.location.lng, vehicle.location.lat])
        .setPopup(new maplibregl.Popup().setText(vehicle.plateNumber))
        .addTo(mapRef.current!);
    });
  }, [vehicles]);

  return <div ref={mapContainer} className="w-full h-screen" />;
}
