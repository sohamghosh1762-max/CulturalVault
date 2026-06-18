"use client";

import { useEffect, useState } from "react";

export function useRiskSites() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSites() {
      try {
        const res = await fetch("/api/risk-sites");
        const apiSites = await res.json();
        const apiSitesArray = Array.isArray(apiSites) ? apiSites : [];

        const localSites = JSON.parse(
          localStorage.getItem("heritageSites") || "[]"
        );

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSites();
  }, []);

  return { sites, loading };
}