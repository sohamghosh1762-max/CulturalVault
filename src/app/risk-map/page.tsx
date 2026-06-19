"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Search, History } from "lucide-react";
import dynamic from "next/dynamic";
import RiskCard from "@/components/risk/RiskCard";
import { useRiskSites } from "@/hooks/useRiskSites";
import { recordRecentlyViewed } from "@/utils";

// Dynamic Leaflet import to prevent Server-Side Rendering errors
const WorldMap = dynamic(
  () => import("@/components/risk/WorldMap"),
  {
    ssr: false,
  }
);

// Haversine formula to compute distance in km
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Local Geolocation Database for recent searches coordinates
const LOCAL_GEO_DB: Record<string, { lat: number; lng: number }> = {
  "karnataka": { lat: 15.3173, lng: 75.7139 },
  "maharashtra": { lat: 19.7515, lng: 75.7139 },
  "uttar pradesh": { lat: 26.8467, lng: 80.9462 },
  "delhi": { lat: 28.7041, lng: 77.1025 },
  "rajasthan": { lat: 27.0238, lng: 74.2179 },
  "west bengal": { lat: 22.9868, lng: 87.8550 },
  "odisha": { lat: 20.9517, lng: 85.0985 },
  "tamil nadu": { lat: 11.1271, lng: 78.6569 },
  "madhya pradesh": { lat: 22.9734, lng: 78.6569 },
  "bihar": { lat: 25.0961, lng: 85.3131 },
  "kerala": { lat: 10.8505, lng: 76.2711 },
  "andhra pradesh": { lat: 15.9129, lng: 79.7400 },
  "telangana": { lat: 18.1124, lng: 79.0193 },
  "gujarat": { lat: 22.2587, lng: 71.1924 },
  "punjab": { lat: 31.1471, lng: 75.3412 },
  "haryana": { lat: 29.0588, lng: 76.0856 },
  "himachal pradesh": { lat: 31.1048, lng: 77.1734 },
  "uttarakhand": { lat: 30.0668, lng: 79.0193 },
  "jammu and kashmir": { lat: 33.7782, lng: 76.5762 },
  "assam": { lat: 26.2006, lng: 92.9376 },
  "agra": { lat: 27.1767, lng: 78.0081 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "jaipur": { lat: 26.9124, lng: 75.7873 },
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  "chennai": { lat: 13.0827, lng: 80.2707 },
  "bengaluru": { lat: 12.9716, lng: 77.5946 },
  "bangalore": { lat: 12.9716, lng: 77.5946 },
  "hyderabad": { lat: 17.3850, lng: 78.4867 },
  "pune": { lat: 18.5204, lng: 73.8567 },
  "ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "lucknow": { lat: 26.8467, lng: 80.9462 },
  "patna": { lat: 25.5941, lng: 85.1376 },
  "bhopal": { lat: 23.2599, lng: 77.4126 },
  "bhubaneswar": { lat: 20.2961, lng: 85.8245 },
  "aurangabad": { lat: 19.8762, lng: 75.3433 },
  "kochi": { lat: 9.9312, lng: 76.2673 },
  "india": { lat: 20.5937, lng: 78.9629 }
};

export default function RiskMapPage() {
  const { sites, loading } = useRiskSites();
  
  useEffect(() => {
    console.log("RiskMapPage state:", { loading, sitesCount: sites.length });
  }, [loading, sites]);
  
  // Shared States with Map Component
  const [selectedSite, setSelectedSite] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchLocation, setSearchLocation] = useState<[number, number] | null>(null);
  
  // Search and Filtering states
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [currentSearchLabel, setCurrentSearchLabel] = useState("Showing all locations globally");
  const [overviewSearchQuery, setOverviewSearchQuery] = useState("");

  // Load search history from local storage
  useEffect(() => {
    const saved = localStorage.getItem("riskSearchHistory");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    // Record view of Risk Management
    recordRecentlyViewed({
      type: "risk",
      title: "Heritage Risk Intelligence Dashboard",
      path: "/risk-map"
    });
  }, []);

  const handleMapSearchPerformed = (query: string, lat: number, lng: number) => {
    // 1. Update search status label
    if (query === "GPS Location") {
      setCurrentSearchLabel("Showing sites near detected GPS location");
    } else {
      setCurrentSearchLabel(`Showing sites near "${query}"`);
      
      // 2. Save query in recent searches history
      setRecentSearches((prev) => {
        const cleanedQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
        const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
        const updated = [cleanedQuery, ...filtered].slice(0, 5); // limit to 5 entries
        localStorage.setItem("riskSearchHistory", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleRecentSearchClick = async (query: string) => {
    const q = query.trim().toLowerCase();
    
    // Check local coords directory
    if (LOCAL_GEO_DB[q]) {
      const coords = LOCAL_GEO_DB[q];
      setSearchLocation([coords.lat, coords.lng]);
      setCurrentSearchLabel(`Showing sites near "${query}"`);
      
      // Find and select closest site automatically
      if (sites && sites.length > 0) {
        let minDistance = Infinity;
        let nearest = null;
        sites.forEach((site: any) => {
          const dist = getDistance(coords.lat, coords.lng, site.lat, site.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = site;
          }
        });
        if (nearest) {
          setSelectedSite(nearest);
        }
      }
      return;
    }

    // nominatim lookup fallback
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setSearchLocation([lat, lng]);
        setCurrentSearchLabel(`Showing sites near "${query}"`);
        
        if (sites && sites.length > 0) {
          let minDistance = Infinity;
          let nearest = null;
          sites.forEach((site: any) => {
            const dist = getDistance(lat, lng, site.lat, site.lng);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = site;
            }
          });
          if (nearest) {
            setSelectedSite(nearest);
          }
        }
      }
    } catch (err) {
      console.error("OSM recent search geocode error:", err);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("riskSearchHistory");
  };

  const resetAllFilters = () => {
    setSelectedSite(null);
    setUserLocation(null);
    setSearchLocation(null);
    setOverviewSearchQuery("");
    setCurrentSearchLabel("Showing all locations globally");
  };

  // KPI Calculations
  const highRisk = sites.filter(
    (site: any) => site.risk === "High"
  ).length;

  const mediumRisk = sites.filter(
    (site: any) => site.risk === "Medium"
  ).length;

  const lowRisk = sites.filter(
    (site: any) => site.risk === "Low"
  ).length;

  // Compute card display order dynamically
  let displaySites = [...sites];
  const activeOrigin = searchLocation || userLocation;

  if (activeOrigin) {
    displaySites = displaySites.map((site: any) => {
      const dist = getDistance(activeOrigin[0], activeOrigin[1], site.lat, site.lng);
      return { ...site, distance: dist };
    });
    // Sort nearest distance first
    displaySites.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  if (overviewSearchQuery) {
    const q = overviewSearchQuery.toLowerCase().trim();
    displaySites = displaySites.filter(
      (site: any) =>
        site.name.toLowerCase().includes(q) ||
        site.country.toLowerCase().includes(q) ||
        (site.state && site.state.toLowerCase().includes(q)) ||
        site.risk.toLowerCase() === q
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-xl">Loading Heritage Risk Data...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="text-red-500" size={34} />

        <div>
          <h1 className="text-4xl font-bold">
            Heritage Risk Intelligence
          </h1>

          <p className="text-muted-foreground mt-2">
            Monitor endangered cultural heritage sites using
            AI-inspired risk assessment.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-muted-foreground text-sm">
            Total Sites
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {sites.length}
          </h2>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <p className="text-muted-foreground text-sm">
            High Risk
          </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {highRisk}
          </h2>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <p className="text-muted-foreground text-sm">
            Medium Risk
          </p>

          <h2 className="text-3xl font-bold text-yellow-500 mt-2">
            {mediumRisk}
          </h2>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <p className="text-muted-foreground text-sm">
            Low Risk
          </p>

          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {lowRisk}
          </h2>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Global Heritage Risk Map
        </h2>

        <WorldMap
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          onSearch={handleMapSearchPerformed}
        />
      </div>

      {/* Search History & Filter Labels Banner */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm mb-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active Search Context</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-semibold text-foreground">{currentSearchLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <History size={12} className="text-primary" /> Recent filters:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {recentSearches.length === 0 ? (
              // Pre-populate with default interesting locations when there is no search history
              ["Karnataka", "Maharashtra", "Delhi", "Rajasthan"].map((search, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentSearchClick(search)}
                  className="text-xs bg-secondary hover:bg-primary/10 hover:text-primary transition px-2.5 py-1 rounded-full font-medium border border-border text-foreground animate-fade-in"
                >
                  {search}
                </button>
              ))
            ) : (
              // Render user recent searches
              recentSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentSearchClick(search)}
                  className="text-xs bg-secondary hover:bg-primary/10 hover:text-primary transition px-2.5 py-1 rounded-full font-medium border border-border text-foreground animate-fade-in"
                >
                  {search}
                </button>
              ))
            )}
            {recentSearches.length > 0 && (
              <button 
                onClick={clearRecentSearches}
                className="text-[10px] text-red-500 hover:underline ml-1 font-semibold"
              >
                Clear History
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Risk Assessment Overview Heading & Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Risk Assessment Overview
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeOrigin 
              ? "Heritage sites sorted by distance from search/GPS location (nearest first)." 
              : "Overview of registered endangered cultural heritage sites."}
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto items-center">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Filter list by name, state, risk..."
              value={overviewSearchQuery}
              onChange={(e) => setOverviewSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-card text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition shadow-sm"
            />
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={14} />
          </div>

          {(activeOrigin || overviewSearchQuery) && (
            <button
              onClick={resetAllFilters}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3.5 py-2.5 rounded-xl border border-red-500/20 font-semibold transition shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySites.map((site: any) => (
            <RiskCard
              key={site.id}
              site={site}
              isSelected={selectedSite?.id === site.id}
              onSelect={() => {
                setSelectedSite(site);
                window.scrollTo({ top: 380, behavior: "smooth" }); // Smooth scroll map into view
              }}
            />
          ))}
        </div>

        {displaySites.length === 0 && (
          <div className="text-center py-16 border border-dashed rounded-3xl p-8 bg-card flex flex-col items-center gap-2 mt-4">
            <Search className="text-muted-foreground/30 mb-2" size={32} />
            <h4 className="font-semibold text-foreground">No matches found</h4>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              No registered heritage sites match your overview filter. Try searching for "High", a state like "Maharashtra", or click Reset Filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}