"use client";

import { motion } from "framer-motion";

interface Props {
  site: {
    name: string;
    country: string;
    risk: string;
    score: number;
    reason: string;
  };
}

export default function RiskCard({ site }: Props) {
  const color =
    site.risk === "High"
      ? "bg-red-500"
      : site.risk === "Medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div className="flex justify-between">
        <h3 className="text-lg font-bold">{site.name}</h3>

        <span
          className={`${color} text-white text-xs px-3 py-1 rounded-full`}
        >
          {site.risk}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mt-1">
        {site.country}
      </p>

      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <span>Risk Score</span>
          <span>{site.score}%</span>
        </div>

        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className={`${color} h-2 rounded-full`}
            style={{ width: `${site.score}%` }}
          />
        </div>
      </div>

      <p className="text-sm mt-4">
        {site.reason}
      </p>
    </motion.div>
  );
}