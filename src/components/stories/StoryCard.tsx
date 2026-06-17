"use client";

import Link from "next/link";

export default function StoryCard({
  story,
}: {
  story: any;
}) {
  return (
    <Link href={`/stories/${story._id}`}>
      <div className="border rounded-2xl p-6 bg-card hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            🏛 {story.title}
          </h3>

          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
            {story.category}
          </span>
        </div>

        <p className="text-muted-foreground mt-3">
          Click to explore this oral heritage story
        </p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span>
            📍 {story.region}
          </span>

          <span>
            ⭐ {story.score}
          </span>
        </div>

        <div className="mt-4 text-primary font-medium">
          View Story →
        </div>
      </div>
    </Link>
  );
}