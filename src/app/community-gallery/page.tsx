"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CommunityGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchContributions();
  }, []);

  async function fetchContributions() {
    try {
      const res = await fetch(
        "/api/contributions"
      );

      const data = await res.json();

      setGallery(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        Loading Community Gallery...
      </div>
    );
  }

  const filteredGallery = gallery.filter((item) => {
  const matchesSearch =
    item.title
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    item.region
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" ||
    item.category === category;

  return matchesSearch && matchesCategory;
});

const featuredItem =
  gallery.length > 0 ? gallery[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Hero */}

      <div className="mb-12 text-center">

  <h1 className="text-6xl font-bold mb-4">
    🌍 Community Heritage Gallery
  </h1>

  <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
    Discover stories, traditions,
    rituals, folklore and cultural
    heritage contributions shared by
    communities around the world.
  </p>

</div>

<div className="grid md:grid-cols-4 gap-5 mb-10">

  <div className="border rounded-2xl p-5 text-center">
    <h3 className="text-3xl font-bold">
      {gallery.length}
    </h3>
    <p>Total Contributions</p>
  </div>

  <div className="border rounded-2xl p-5 text-center">
    <h3 className="text-3xl font-bold">
      {gallery.reduce(
        (sum, item) =>
          sum + (item.likes || 0),
        0
      )}
    </h3>
    <p>Total Likes</p>
  </div>

  <div className="border rounded-2xl p-5 text-center">
    <h3 className="text-3xl font-bold">
      {gallery.reduce(
        (sum, item) =>
          sum + (item.views || 0),
        0
      )}
    </h3>
    <p>Total Views</p>
  </div>

  <div className="border rounded-2xl p-5 text-center">
    <h3 className="text-3xl font-bold">
      {
        new Set(
          gallery.map(
            (item) => item.region
          )
        ).size
      }
    </h3>
    <p>Regions Covered</p>
  </div>

</div>

<div className="flex flex-col md:flex-row gap-4 mb-10">

  <input
    placeholder="Search heritage..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="border rounded-xl p-3 flex-1"
  />

  <select
    value={category}
    onChange={(e) =>
      setCategory(e.target.value)
    }
    className="border rounded-xl p-3"
  >
    <option>All</option>

    {[...new Set(
      gallery.map(
        (item) => item.category
      )
    )].map((cat) => (
      <option key={cat}>
        {cat}
      </option>
    ))}
  </select>

</div>

      {/* Empty State */}

      {gallery.length === 0 && (
        <div className="border rounded-3xl p-16 text-center bg-card">

  <h2 className="text-3xl font-bold mb-4">
    🌍 No Heritage Contributions Yet
  </h2>

  <p className="text-muted-foreground">
    Be the first contributor to preserve
    cultural knowledge for future generations.
  </p>

  <Link
    href="/contribute"
    className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl"
  >
    Submit First Contribution
  </Link>

</div>
      )}

      {featuredItem && (
  <div className="border rounded-3xl overflow-hidden mb-12">

    {featuredItem.image && (
      <img
        src={featuredItem.image}
        className="w-full h-[450px] object-cover"
      />
    )}

    <div className="p-8">

      <span className="bg-orange-500 text-white px-4 py-2 rounded-full">
        Featured Heritage
      </span>

      <Link
  href={`/community-gallery/${featuredItem._id}`}
>
  <h2 className="text-4xl font-bold mt-4 hover:text-orange-500">
    {featuredItem.title}
  </h2>
</Link>

      <p className="mt-4 text-muted-foreground">
        {featuredItem.description?.slice(
          0,
          250
        )}
        ...
      </p>

    </div>
  </div>
)}

      {/* Gallery */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredGallery.map((item) => (
          <div
            key={item._id}
            className="group overflow-hidden rounded-3xl border bg-card hover:shadow-xl transition-all duration-300"
          >

            {/* Image */}

            {item.image && (
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute top-4 left-4">
                  <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                    {item.category}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}

            <div className="p-5">

              <h3 className="text-2xl font-bold">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 mt-3">

  <p className="text-sm text-muted-foreground">
    👤 {item.contributor}
  </p>

  <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-[10px]">
    Contributor
  </span>

</div>

              <p className="text-sm text-muted-foreground">
                📍 {item.region}
              </p>

              <div className="mt-2">
  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
    Heritage Score: {item.heritageScore || 75}
  </span>
</div>

              <div className="flex gap-4 mt-3 text-sm">
                <span>
                  ❤️ {item.likes || 0}
                </span>

                <span>
                  👁 {item.views || 0}
                </span>
              </div>

              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">

                  {item.tags.map(
                    (
                      tag: string,
                      index: number
                    ) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    )
                  )}

                </div>
              )}

              <p className="mt-4 text-muted-foreground line-clamp-4">
                {item.description}
              </p>

              <Link
  href={`/community-gallery/${item._id}`}
  className="block mt-5 w-full bg-orange-500 text-white py-3 rounded-xl text-center hover:bg-orange-600"
>
  Explore Heritage →
</Link>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}