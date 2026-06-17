"use client";

import { ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";
import RiskCard from "@/components/risk/RiskCard";
import { useRiskSites } from "@/hooks/useRiskSites";

const WorldMap = dynamic(
  () => import("@/components/risk/WorldMap"),
  {
    ssr: false,
  }
);

export default function RiskMapPage() {
  const { sites, loading } = useRiskSites();

  const highRisk = sites.filter(
    (site: any) => site.risk === "High"
  ).length;

  const mediumRisk = sites.filter(
    (site: any) => site.risk === "Medium"
  ).length;

  const lowRisk = sites.filter(
    (site: any) => site.risk === "Low"
  ).length;

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
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Global Heritage Risk Map
        </h2>

        <WorldMap />
      </div>

      {/* Risk Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">
          Risk Assessment Overview
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site: any) => (
            <RiskCard
              key={site.id}
              site={site}
            />
          ))}
        </div>
      </div>
    </div>
  );
}