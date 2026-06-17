"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const StoryLocationMap = dynamic(
  () =>
    import(
      "@/components/stories/StoryLocationMap"
    ),
  {
    ssr: false,
  }
);

export default function StoryDetailsPage() {
  const params = useParams();

  const [story, setStory] = useState<any>(
    null
  );
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchStory() {
      try {
        const res = await fetch(
          "/api/stories"
        );

        const stories =
          await res.json();

        const selectedStory =
          stories.find(
            (item: any) =>
              item._id === params.id
          );

        setStory(selectedStory);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        Loading Story...
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        Story Not Found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="border rounded-3xl p-8 bg-card">
         {/* Story Cover Image */}
      {story.image && (
        <div className="mb-8">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-[500px] object-cover rounded-3xl border"
          />
        </div>
      )}
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              🏛 {story.title}
            </h1>

            <p className="text-muted-foreground mt-2">
              Oral Heritage Story
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold">
            {story.category}
          </span>
        </div>

        {/* Story Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-4">
              Story Information
            </h2>

            <div className="space-y-2">
              <p>
                🌍 <strong>Region:</strong>{" "}
                {story.region}
              </p>

              <p>
                🗣{" "}
                <strong>Language:</strong>{" "}
                {story.language}
              </p>

              <p>
                🎙{" "}
                <strong>Narrator:</strong>{" "}
                {story.narrator}
              </p>
            </div>
          </div>

          <div className="border rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-4">
              Preservation Data
            </h2>

            <div className="space-y-2">
              <p>
                ⭐ <strong>Score:</strong>{" "}
                {story.score}
              </p>

            <div className="mt-4">
  {story.score >= 90 ? (
    <span className="bg-green-500 text-white px-4 py-2 rounded-full">
      🏆 Heritage Treasure
    </span>
  ) : story.score >= 70 ? (
    <span className="bg-yellow-500 text-white px-4 py-2 rounded-full">
      ⭐ Well Preserved
    </span>
  ) : (
    <span className="bg-red-500 text-white px-4 py-2 rounded-full">
      ⚠ Needs Preservation
    </span>
  )}
</div>

              <p>
                📍 <strong>Latitude:</strong>{" "}
                {story.lat}
              </p>

              <p>
                📍{" "}
                <strong>Longitude:</strong>{" "}
                {story.lng}
              </p>
            </div>

            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${story.score}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Story Description
          </h2>

          <p className="whitespace-pre-wrap leading-8 text-lg text-muted-foreground">
            {story.description}
          </p>
        </div>

        {/* Audio */}
        {story.audio && (
          <div className="border rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Audio Narration
            </h2>

            <audio
              controls
              className="w-full"
            >
              <source
                src={story.audio}
              />
            </audio>
          </div>
        )}

        {/* Story Gallery */}
{story.gallery?.length > 0 && (
  <div className="border rounded-2xl p-6 mb-8">
    <h2 className="text-2xl font-bold mb-4">
      📸 Story Gallery
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {story.gallery.map(
        (image: string, index: number) => (
          <img
            key={index}
            src={image}
            alt={`Gallery ${index + 1}`}
            className="w-full h-64 object-cover rounded-xl border hover:scale-105 transition"
          />
        )
      )}
    </div>
  </div>
)}


        {/* Location */}
        <div className="border rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            📍 Story Location
          </h2>

          <p className="text-muted-foreground mb-4">
            This map shows the exact
            location associated with
            this oral heritage story.
          </p>

          <StoryLocationMap
            lat={Number(story.lat)}
            lng={Number(story.lng)}
            title={story.title}
          />
        </div>
      </div>
    </div>
  );
}