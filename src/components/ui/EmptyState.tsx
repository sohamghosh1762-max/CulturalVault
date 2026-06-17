"use client";

import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search size={24} className="text-muted-foreground" />
      </div>
      <h2 className="font-display text-xl font-semibold mb-2">No results found</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        Try adjusting your search or filters to discover more cultural treasures.
      </p>
    </div>
  );
}
