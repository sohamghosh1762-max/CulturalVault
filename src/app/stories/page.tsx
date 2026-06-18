"use client";

import { useState } from "react";
import StoryUpload from "@/components/stories/StoryUpload";
import StoryList from "@/components/stories/StoryList";

export default function StoriesPage() {
  const [editingStory, setEditingStory] = useState<any>(null);

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
        <StoryUpload editingStory={editingStory} setEditingStory={setEditingStory} />
      </div>

      {/* Stories Section */}
      <div>
        <StoryList onEditStory={setEditingStory} />
      </div>
    </div>
  );
}