"use client";

import StoryUpload from "@/components/stories/StoryUpload";
import StoryList from "@/components/stories/StoryList";

export default function StoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-3">
          🎙 Oral Story Preservation Platform
        </h1>

        <p className="text-lg text-muted-foreground">
          Preserve folk tales, oral histories, tribal legends,
          cultural memories, and indigenous storytelling traditions
          for future generations.
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-12">
        <StoryUpload />
      </div>

      {/* Stories Section */}
      <div>
        <StoryList />
      </div>
    </div>
  );
}