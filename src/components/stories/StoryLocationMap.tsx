"use client";

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
  if (!lat || !lng) {
    return (
      <div className="border rounded-2xl p-6 text-center">
        No location available
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border">
      <MapContainer
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