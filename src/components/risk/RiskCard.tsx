"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Navigation } from "lucide-react";

interface Props {
  site: {
    id: number;
    name: string;
    country: string;
    state?: string;
    risk: string;
    score: number;
    reason: string;
    famous?: boolean;
    description?: string;
    distance?: number;
  };
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function RiskCard({ site, isSelected = false, onSelect }: Props) {
  const color =
    site.risk === "High"
      ? "bg-red-500/10 text-red-500 border border-red-500/20"
      : site.risk === "Medium"
      ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
      : "bg-green-500/10 text-green-500 border border-green-500/20";

  const progressColor =
    site.risk === "High"
      ? "bg-red-500"
      : site.risk === "Medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={onSelect}
      className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? "border-primary bg-primary/[0.03] shadow-md ring-1 ring-primary/20"
          : "border-border bg-card hover:border-border-hover"
      }`}
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium">
                {site.state ? `${site.state}, ${site.country}` : site.country}
              </span>
              {site.famous && (
                <span className="flex items-center gap-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.2 rounded border border-amber-500/20">
                  <Star size={8} fill="currentColor" /> FAMOUS
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-foreground mt-1.5 tracking-tight line-clamp-1">{site.name}</h3>
          </div>

          <span
            className={`${color} text-xs px-2.5 py-0.5 rounded-full font-semibold`}
          >
            {site.risk}
          </span>
        </div>

        {site.distance !== undefined && (
          <p className="text-xs font-semibold text-primary mt-2 flex items-center gap-1">
            <Navigation size={12} className="rotate-45" />
            {site.distance < 1
              ? `${Math.round(site.distance * 1000)} meters away`
              : `${site.distance.toFixed(1)} km away`}
          </p>
        )}

        {site.description && (
          <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
            {site.description}
          </p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/50">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>AI Risk Score</span>
          <span>{site.score}%</span>
        </div>

        <div className="w-full bg-muted rounded-full h-1.5 mt-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${site.score}%` }}
            transition={{ duration: 0.8 }}
            className={`${progressColor} h-1.5 rounded-full`}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-3 italic line-clamp-1">
          "{site.reason}"
        </p>
      </div>
    </motion.div>
  );
}