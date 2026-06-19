"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CommunityGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentSlide, setCurrentSlide] =
  useState(0);

  useEffect(() => {
  fetchContributions();
}, []);

  useEffect(() => {
  if (gallery.length === 0) return;

  const interval = setInterval(() => {
    setCurrentSlide((prev) =>
      prev === gallery.length - 1
        ? 0
        : prev + 1
    );
  }, 5000);

  return () => clearInterval(interval);
}, [gallery]);

  async function fetchContributions() {
    try {
      const res = await fetch(
        "/api/contributions"
      );

      const data = await res.json();

      setGallery(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setGallery([]);
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

  const filteredGallery = Array.isArray(gallery) ? gallery.filter((item) => {
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
}) : [];

const safeGallery = Array.isArray(gallery)
  ? gallery
  : [];

const featuredItem =
  safeGallery.length > 0
    ? safeGallery[currentSlide]
    : null;
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

    {Array.from(new Set(
      gallery.map(
        (item) => item.category
      )
    )).map((cat) => (
      <option key={cat}>
        {cat}
      </option>
    ))}
  </select>

</div>

      {/* Empty State */}

      {safeGallery.length === 0 && (
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
  <div className="relative mb-12 overflow-hidden rounded-3xl border">

    {/* Background Image */}
    <img
      src={featuredItem.image}
      alt={featuredItem.title}
      className="w-full h-[550px] object-cover transition-all duration-700"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

    {/* Content */}
    <div className="absolute bottom-0 left-0 p-10 max-w-4xl">

      <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm">
        Featured Heritage
      </span>

      <h2 className="text-5xl font-bold text-white mt-5">
        {featuredItem.title}
      </h2>

      <p className="text-white/80 mt-4 text-lg">
        {featuredItem.description?.slice(0, 220)}...
      </p>

      <div className="flex gap-6 mt-5 text-white">
        <span>📍 {featuredItem.region}</span>
        <span>❤️ {featuredItem.likes || 0}</span>
        <span>👁 {featuredItem.views || 0}</span>
      </div>

      <Link
        href={`/community-gallery/${featuredItem._id}`}
        className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
      >
        Explore Heritage →
      </Link>
    </div>

    {/* Previous */}
    <button
      onClick={() =>
        setCurrentSlide(
          currentSlide === 0
            ? safeGallery.length - 1
            : currentSlide - 1
        )
      }
      className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/60 text-white w-12 h-12 rounded-full"
    >
      ←
    </button>

    {/* Next */}
    <button
      onClick={() =>
        setCurrentSlide(
          currentSlide === safeGallery.length - 1
            ? 0
            : currentSlide + 1
        )
      }
      className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/60 text-white w-12 h-12 rounded-full"
    >
      →
    </button>

    {/* Dots */}
    <div className="absolute bottom-5 right-10 flex gap-2">
      {safeGallery.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`h-3 w-3 rounded-full ${
            currentSlide === index
              ? "bg-orange-500"
              : "bg-white/50"
          }`}
        />
      ))}
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

              <div className="flex flex-wrap items-center justify-between mt-3 text-xs text-muted-foreground border-t border-border/50 pt-3">
                <span>📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Just now"}</span>
                <div className="flex items-center gap-3">
                  <span>👁️ {item.views || 0}</span>
                  <span>❤️ {item.likes || 0}</span>
                  <span>💬 {item.commentsCount || 0}</span>
                </div>
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