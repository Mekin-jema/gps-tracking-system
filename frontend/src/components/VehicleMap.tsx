
"use client";

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface VehicleMapProps {
  vehicleId?: string;
  adminView?: boolean;
}

export default function VehicleMap({ vehicleId, adminView = false }: VehicleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [lng] = useState(0);
  const [lat] = useState(0);
  const [zoom] = useState(2);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [marker, setMarker] = useState<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAPLIBRE_STYLE,
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Initialize marker
    const newMarker = new maplibregl.Marker({
      color: '#FF0000',
      draggable: false
    }).setLngLat([0, 0]);
    setMarker(newMarker);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!vehicleId || !map.current || !marker) return;

    // Fetch initial position
    const fetchPosition = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicleId}/position`);
        const [lng, lat] = res.data.position;
        marker.setLngLat([lng, lat]).addTo(map.current!);
        map.current?.flyTo({ center: [lng, lat], zoom: 15 });
      } catch (error) {
        console.error('Error fetching vehicle position:', error);
      }
    };

    fetchPosition();

    // Setup socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join-vehicle-room', vehicleId);

    newSocket.on('position-update', (data: { vehicleId: string; position: [number, number] }) => {
      if (data.vehicleId === vehicleId) {
        marker.setLngLat(data.position).addTo(map.current!);
        if (!adminView) {
          map.current?.flyTo({ center: data.position, zoom: 15 });
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [vehicleId, marker]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  );
}