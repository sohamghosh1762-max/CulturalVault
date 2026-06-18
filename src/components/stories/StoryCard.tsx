"use client";

import Link from "next/link";

export default function StoryCard({
  story,
  onEdit,
  onDelete,
}: {
  story: any;
  onEdit?: (story: any) => void;
  onDelete?: (id: number) => void;
}) {
  const currentUser = JSON.parse(
    localStorage.getItem("userAccount") || "{}"
  );

  const isOwner =
    currentUser?.id === story?.userId;

  return (
    <div className="border rounded-2xl p-6 bg-card hover:shadow-xl hover:scale-[1.02] transition-all">

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

          <div className="mt-4 text-primary font-medium">
            View Story →
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