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

export default function CommunityDetailsPage() {
  const params = useParams();

  const [item, setItem] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(
          "/api/contributions"
        );

        const data =
          await res.json();

        const selected =
          data.find(
            (contribution: any) =>
              contribution._id ===
              params.id
          );

        setItem(selected);
        await fetch(
  `/api/contributions/${selected._id}/view`,
  {
    method: "PATCH",
  }
);

selected.views =
  (selected.views || 0) + 1;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        Loading Contribution...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        Contribution Not Found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Hero Image */}

      {item.image && (
        <div className="mb-10">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-[550px] object-cover rounded-3xl border"
          />
        </div>
      )}

      {item.featured && (
  <div className="mb-6 bg-orange-500 text-white p-4 rounded-2xl text-center font-semibold">
    ⭐ Featured Community Heritage
  </div>
)}

      <div className="flex flex-wrap gap-4 mb-8">

  <button
    onClick={async () => {
  const alreadyLiked =
    localStorage.getItem(
      `liked-${item._id}`
    );

  if (alreadyLiked) {
    alert(
      "You already liked this heritage."
    );
    return;
  }

  await fetch(
    `/api/contributions/${item._id}/like`,
    {
      method: "PATCH",
    }
  );

  localStorage.setItem(
    `liked-${item._id}`,
    "true"
  );

  setItem({
    ...item,
    likes: (item.likes || 0) + 1,
  });
}}
    className="border rounded-xl px-5 py-3 hover:bg-orange-500 hover:text-white"
  >
    ❤️ {item.likes || 0} Likes
  </button>

  <div className="border rounded-xl px-5 py-3">
    👁 {item.views || 0} Views
  </div>

  <div className="border rounded-xl px-5 py-3">
    📅 {new Date(item.createdAt).toLocaleDateString()}
  </div>

</div>

      {/* Header */}

      <div className="border rounded-3xl p-8 bg-card mb-8">

        <div className="flex flex-col md:flex-row md:justify-between gap-4">

          <div>
            <h1 className="text-5xl font-bold flex items-center gap-3">
  🏛 {item.title}

  {item.verified && (
    <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
      ✓ Verified Heritage
    </span>
  )}
</h1>

            <p className="text-muted-foreground mt-3">
              Community Heritage Contribution
            </p>
          </div>

          <div>
            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold">
              {item.category}
            </span>
          </div>

        </div>

      </div>

      <div className="mb-8">

  {item.importanceLevel ===
  "High" ? (

    <div className="bg-green-500 text-white p-4 rounded-2xl">
      🌟 High Cultural Importance
    </div>

  ) : item.importanceLevel ===
    "Medium" ? (

    <div className="bg-yellow-500 text-white p-4 rounded-2xl">
      ⭐ Medium Cultural Importance
    </div>

  ) : (

    <div className="bg-blue-500 text-white p-4 rounded-2xl">
      📖 Community Heritage Record
    </div>

  )}

</div>

      {/* Information Cards */}

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="border rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            Contributor Information
          </h2>

          <div className="space-y-3">

            <p>
              👤 <strong>Name:</strong>{" "}
              {item.contributor}
            </p>

            <p>
              📍 <strong>Region:</strong>{" "}
              {item.region}
            </p>

            <p>
              🏷 <strong>Category:</strong>{" "}
              {item.category}
            </p>

            <p>
  🏺 <strong>Cultural Era:</strong>{" "}
  {item.culturalEra}
</p>

<p>
  📚 <strong>Source Type:</strong>{" "}
  {item.sourceType}
</p>

<p>
  🛡 <strong>Preservation Status:</strong>{" "}
  {item.preservationStatus}
</p>

<p>
  ⭐ <strong>Importance Level:</strong>{" "}
  {item.importanceLevel}
</p>

          </div>

        </div>

        <div className="border rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            Community Statistics
          </h2>

          <div className="space-y-3">

            <p>
              ❤️ <strong>Likes:</strong>{" "}
              {item.likes || 0}
            </p>

            <p>
              👁 <strong>Views:</strong>{" "}
              {item.views || 0}
            </p>

            <p>
  🏆 <strong>Heritage Score:</strong>{" "}
  {item.heritageScore || 75}
</p>


            <p>
              📅 <strong>Created:</strong>{" "}
              {new Date(
                item.createdAt
              ).toLocaleDateString()}
            </p>

            <p>
  🎖 <strong>Badge:</strong>{" "}
  {item.badge || "Explorer"}
</p>

          </div>

          <div className="mt-4">
  <div className="w-full bg-muted rounded-full h-3">
    <div
      className={`h-3 rounded-full ${
        item.heritageScore >= 90
          ? "bg-green-500"
          : item.heritageScore >= 70
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
      style={{
        width: `${item.heritageScore || 75}%`,
      }}
    />
  </div>
</div>

        </div>

      </div>

      {/* Tags */}

      {item.tags?.length > 0 && (
        <div className="border rounded-3xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Tags
          </h2>

          <div className="flex flex-wrap gap-3">

            {item.tags.map(
              (
                tag: string,
                index: number
              ) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-orange-500/10 text-orange-500 rounded-full"
                >
                  #{tag}
                </span>
              )
            )}

          </div>

        </div>
      )}

      {/* Description */}

      <div className="border rounded-3xl p-8 mb-8">

        <h2 className="text-3xl font-bold mb-5">
          Heritage Description
        </h2>

        <p className="whitespace-pre-wrap leading-8 text-lg text-muted-foreground">
          {item.description}
        </p>

      </div>

      {item.audio && (
  <div className="border rounded-3xl p-8 mb-8">

    <h2 className="text-3xl font-bold mb-5">
      🎙 Audio Narration
    </h2>

    <audio
      controls
      className="w-full"
    >
      <source src={item.audio} />
    </audio>

  </div>
)}

      {/* Map */}

      {item.lat && item.lng && (
        <div className="border rounded-3xl p-8">

          <h2 className="text-3xl font-bold mb-5">
            📍 Heritage Location
          </h2>

          <p className="text-muted-foreground mb-4">
            This map displays the
            location associated with
            this community contribution.
          </p>

          <StoryLocationMap
            lat={Number(item.lat)}
            lng={Number(item.lng)}
            title={item.title}
          />

        </div>
      )}

    </div>
  );
}