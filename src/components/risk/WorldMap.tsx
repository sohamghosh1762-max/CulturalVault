"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import { useRiskSites } from "@/hooks/useRiskSites";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function WorldMap() {
  const { sites, loading } = useRiskSites();

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center border rounded-2xl">
        Loading map...
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <MapContainer
        center={[25, 15]}
        zoom={2}
        style={{
          height: "600px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sites.map((site: any) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">
                  {site.name}
                </h3>

                <p>{site.country}</p>

                <p>
                  Risk Level: {site.risk}
                </p>

                <p>
                  Risk Score: {site.score}%
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}