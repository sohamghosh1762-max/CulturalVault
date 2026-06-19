"use client";

import { useEffect, useState } from "react";

export function useRiskSites() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("useRiskSites: Hook evaluated, current loading state:", loading);

  useEffect(() => {
    console.log("useRiskSites: useEffect callback running...");
    async function loadSites() {
      try {
        console.log("useRiskSites: Fetching /api/risk-sites...");
        const res = await fetch("/api/risk-sites");
        console.log("useRiskSites: Fetch status:", res.status);
        const apiSites = await res.json();
        const apiSitesArray = Array.isArray(apiSites) ? apiSites : [];
        console.log("useRiskSites: apiSites count:", apiSitesArray.length);

        const localSites = JSON.parse(
          localStorage.getItem("heritageSites") || "[]"
        );
        console.log("useRiskSites: localSites count:", localSites.length);

        const formattedLocalSites = localSites.map(
          (site: any) => ({
            id: site.id,
            name: site.name,
            country: site.country,
            risk: site.risk,
            score: site.score || 0,
            reason:
              site.reason || "Added by Administrator",

            lat: Number(site.lat),
            lng: Number(site.lng),
          })
        );

        setSites([
          ...apiSitesArray,
          ...formattedLocalSites,
        ]);
      } catch (error) {
        console.error("useRiskSites error:", error);
      } finally {
        console.log("useRiskSites: setting loading to false");
        setLoading(false);
      }
    }

    loadSites();
  }, []);

  return { sites, loading };
}