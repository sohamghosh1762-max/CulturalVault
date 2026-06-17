"use client";

import { useEffect, useState } from "react";
import StoryCard from "./StoryCard";

export default function StoryList() {
  const [stories, setStories] = useState<any[]>([]);

  const loadStories = async () => {
  try {
    const res = await fetch("/api/stories");

    const data = await res.json();

    setStories(data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    loadStories();

    const refreshStories = () => {
      loadStories();
    };

    window.addEventListener(
      "storiesUpdated",
      refreshStories
    );

    return () => {
      window.removeEventListener(
        "storiesUpdated",
        refreshStories
      );
    };
  }, []);


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          Preserved Stories
        </h2>

        <span className="text-muted-foreground">
          {stories.length} Stories
        </span>
      </div>

      {stories.length === 0 ? (
        <div className="border rounded-2xl p-10 text-center bg-card">
          <h3 className="text-xl font-semibold mb-2">
            No Stories Found
          </h3>

          <p className="text-muted-foreground">
            Upload your first cultural story.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard
  key={story._id}
  story={story}
/>
          ))}
        </div>
      )}
    </div>
  );
}