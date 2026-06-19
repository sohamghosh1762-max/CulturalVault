"use client";

import Link from "next/link";

export default function StoryCard({
  story,
  onEdit,
  onDelete,
}: {
  story: any;
  onEdit?: (story: any) => void;
  onDelete?: (id: any) => void;
}) {
  const currentUser = JSON.parse(
    localStorage.getItem("userAccount") || "{}"
  );

  const isOwner =
    currentUser?.id === story?.userId;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      id: story.id || story._id,
      title: story.title,
      type: "story",
      category: story.category || "Stories",
      description: story.description,
      region: story.region,
      language: story.language,
      narrator: story.narrator
    }));
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      className="border rounded-2xl p-6 bg-card hover:shadow-xl hover:scale-[1.02] transition-all cursor-grab active:cursor-grabbing"
    >

      {/* Story Content */}
      <Link href={`/stories/${story._id || story.id}`}>
        <div className="cursor-pointer">

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

          <div className="mt-3 text-sm text-muted-foreground">
            👤 Added By:{" "}
            {story.userName || "Unknown User"}
          </div>

          <div className="mt-4 text-primary font-medium flex items-center justify-between">
            <span>View Story →</span>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>📅 {story.createdAt ? new Date(story.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Just now"}</span>
            <div className="flex items-center gap-2.5">
              <span>👁️ {story.views !== undefined ? story.views : 0}</span>
              <span>❤️ {story.likes !== undefined ? story.likes : 0}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Owner Controls */}
      {isOwner && (
        <div className="flex gap-3 mt-5">

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(story);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (
                confirm(
                  "Are you sure you want to delete this story?"
                )
              ) {
                onDelete?.(
                  story.id || story._id
                );
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Delete
          </button>

        </div>
      )}
    </div>
  );
}