"use client";

import { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import Link from "next/link";

export default function ContributePage() {
  const [myContributions, setMyContributions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    region: "",
    contributor: "",
    description: "",
    tags: "",
    lat: "",
    lng: "",
    image: "",
    culturalEra: "",
    sourceType: "",
    preservationStatus: "",
    importanceLevel: "",
    audio: "",
  });

  const currentUser = typeof window !== "undefined"
    ? (() => {
        try {
          const ua = localStorage.getItem("userAccount");
          if (ua) {
            const parsed = JSON.parse(ua);
            if (parsed && (parsed.id || parsed.email)) {
              return {
                id: parsed.id || parsed.email || "u1",
                name: parsed.name || "Demo User",
                email: parsed.email || ""
              };
            }
          }
        } catch (e) {}

        try {
          const up = localStorage.getItem("user_profile");
          if (up) {
            const parsed = JSON.parse(up);
            if (parsed && (parsed.id || parsed.email || parsed.name)) {
              return {
                id: parsed.id || parsed.email || "u1",
                name: parsed.name || "Demo User",
                email: parsed.email || ""
              };
            }
          }
        } catch (e) {}

        try {
          if (localStorage.getItem("adminLoggedIn") === "true") {
            return {
              id: "admin",
              name: "Admin User",
              email: "admin@culturalvault.com"
            };
          }
        } catch (e) {}

        return {};
      })()
    : {};

  const fetchMyContributions = useCallback(async () => {
    if (!currentUser.id) return;
    try {
      const res = await fetch("/api/contributions");
      if (res.ok) {
        const data = await res.json();
        const userContributions = (Array.isArray(data) ? data : []).filter(
          (c: any) => c.userId === currentUser.id
        );
        setMyContributions(userContributions);
      }
    } catch (error) {
      console.error("Failed to load contributions:", error);
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchMyContributions();
  }, [fetchMyContributions]);

  useEffect(() => {
    if (currentUser.name && !form.contributor) {
      setForm((prev) => ({ ...prev, contributor: currentUser.name }));
    }
  }, [currentUser.name, form.contributor]);

  async function submitContribution() {
    if (
      !form.title ||
      !form.category ||
      !form.region ||
      !form.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      ...form,
      userId: currentUser.id || "",
      lat: Number(form.lat),
      lng: Number(form.lng),
      tags: form.tags
        ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
    };

    let url = "/api/contributions";
    let method = "POST";

    if (editingId) {
      url = `/api/contributions/${editingId}`;
      method = "PUT";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert(editingId ? "Failed to update contribution" : "Failed to submit contribution");
        return;
      }

      alert(
        editingId
          ? "Contribution Updated Successfully!"
          : "Contribution Submitted Successfully!"
      );

      setForm({
        title: "",
        category: "",
        region: "",
        contributor: "",
        description: "",
        tags: "",
        lat: "",
        lng: "",
        image: "",
        culturalEra: "",
        sourceType: "",
        preservationStatus: "",
        importanceLevel: "",
        audio: "",
      });
      setEditingId(null);
      fetchMyContributions();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  const handleEdit = (c: any) => {
    setForm({
      title: c.title || "",
      category: c.category || "",
      region: c.region || "",
      contributor: c.contributor || "",
      description: c.description || "",
      tags: Array.isArray(c.tags) ? c.tags.join(", ") : "",
      lat: String(c.lat || ""),
      lng: String(c.lng || ""),
      image: c.image || "",
      culturalEra: c.culturalEra || "",
      sourceType: c.sourceType || "",
      preservationStatus: c.preservationStatus || "",
      importanceLevel: c.importanceLevel || "",
      audio: c.audio || "",
    });
    setEditingId(c._id || c.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contribution?")) return;
    try {
      const res = await fetch(`/api/contributions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Contribution Deleted Successfully!");
        fetchMyContributions();
      } else {
        alert("Failed to delete contribution");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete contribution");
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-display mb-3 flex items-center gap-3">
            🌍 Cultural Heritage Community Hub
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Share cultural stories, traditions, festivals, folklore and heritage knowledge with the world.
          </p>
        </div>

        {/* Form Card */}
        <div className="border border-border rounded-3xl p-6 sm:p-8 bg-card shadow-sm">
          <h2 className="text-2xl font-bold mb-6 font-display">
            {editingId ? "🏛 Edit Heritage Contribution" : "🏛 Submit Heritage Contribution"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
            <input
              placeholder="Region"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
            <input
              placeholder="Contributor Name"
              value={form.contributor}
              onChange={(e) => setForm({ ...form, contributor: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
            <input
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
            <input
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              placeholder="Cultural Era (Ancient, Medieval, Colonial...)"
              value={form.culturalEra}
              onChange={(e) => setForm({ ...form, culturalEra: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
            <input
              placeholder="Source Type (Folklore, Festival, Ritual...)"
              value={form.sourceType}
              onChange={(e) => setForm({ ...form, sourceType: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
            <input
              placeholder="Preservation Status"
              value={form.preservationStatus}
              onChange={(e) => setForm({ ...form, preservationStatus: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
            <input
              placeholder="Importance Level (Low / Medium / High)"
              value={form.importanceLevel}
              onChange={(e) => setForm({ ...form, importanceLevel: e.target.value })}
              className="border border-border p-3 rounded-xl bg-background text-foreground"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium">Audio Narration</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setForm((prev) => ({ ...prev, audio: reader.result as string }));
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full border border-border p-3 rounded-xl bg-background text-foreground text-sm"
            />
          </div>

          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full border border-border p-3 rounded-xl mt-4 bg-background text-foreground"
          />

          <textarea
            placeholder="Tell the complete cultural story, tradition, folklore, festival or heritage knowledge..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-border p-3 rounded-xl mt-4 min-h-[200px] bg-background text-foreground"
          />

          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium">Upload Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result as string }));
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full border border-border p-3 rounded-xl bg-background text-foreground text-sm"
            />
          </div>

          {form.image && (
            <div className="mt-4 p-4 border border-border/50 rounded-2xl bg-muted/20">
              <p className="text-xs font-semibold mb-2 text-muted-foreground">Preview Image:</p>
              <img src={form.image} alt="Preview" className="w-full max-h-80 object-cover rounded-xl border" />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={submitContribution}
              className="bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md transition-all"
            >
              {editingId ? "Update Contribution" : "🚀 Submit Contribution"}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    title: "",
                    category: "",
                    region: "",
                    contributor: "",
                    description: "",
                    tags: "",
                    lat: "",
                    lng: "",
                    image: "",
                    culturalEra: "",
                    sourceType: "",
                    preservationStatus: "",
                    importanceLevel: "",
                    audio: "",
                  });
                }}
                className="bg-secondary hover:bg-secondary/80 text-foreground border px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* My Submitted Contributions Section */}
        <div className="border border-border rounded-3xl p-6 sm:p-8 bg-card shadow-sm mt-10">
          <h2 className="text-2xl font-bold mb-6 font-display">
            📂 My Submitted Contributions
          </h2>
          {myContributions.length === 0 ? (
            <p className="text-muted-foreground text-sm italic py-4">
              You haven't submitted any community contributions yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myContributions.map((c) => (
                <div
                  key={c._id || c.id}
                  className="border border-border/60 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-background flex flex-col justify-between"
                >
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.title}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="h-44 w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                      No image uploaded
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-primary/10 text-primary border rounded-full">
                        {c.category}
                      </span>
                      <h3 className="font-bold text-lg mt-3 line-clamp-1">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">📍 {c.region}</p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                        {c.description}
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <Link
                        href={`/community-gallery/${c._id || c.id}`}
                        className="text-primary hover:underline text-xs font-semibold flex items-center gap-1 mb-2"
                      >
                        Explore Heritage Page →
                      </Link>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>📅 {c.createdAt ? new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Just now"}</span>
                        <div className="flex items-center gap-2">
                          <span>👁️ {c.views || 0}</span>
                          <span>❤️ {c.likes || 0}</span>
                          <span>💬 {c.commentsCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border/50 flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id || c.id)}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thank You Section */}
        <div className="border border-border rounded-3xl p-6 sm:p-8 bg-card mt-10 text-center shadow-sm">
          <h3 className="text-2xl font-bold mb-4 font-display">
            🌍 Preserve Culture Together
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Every contribution helps document cultural heritage, oral traditions, rituals, folklore, festivals and community memories for future generations. Your knowledge becomes part of the CulturalVault archive.
          </p>
        </div>

      </div>
    </PageWrapper>
  );
}