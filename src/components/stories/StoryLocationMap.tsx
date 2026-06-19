"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function StoryLocationMap({
  lat,
  lng,
  title,
}: {
  lat: number;
  lng: number;
  title: string;
}) {
  const [mapKey] = useState(() => `map-${Math.random().toString(36).substring(2, 9)}`);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        const container = mapRef.current.querySelector(".leaflet-container") as any;
        if (container) {
          container._leaflet_id = null;
        }
      }
    };
  }, []);

  if (!lat || !lng) {
    return (
      <div className="border rounded-2xl p-6 text-center">
        No location available
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      className="rounded-2xl overflow-hidden border"
    >
      <MapContainer
        key={mapKey}
        center={[lat, lng]}
        zoom={12}
        style={{
          height: "450px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[lat, lng]}
          icon={markerIcon}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">
                🏛 {title}
              </h3>

              <p>
                📍 Story Location
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}