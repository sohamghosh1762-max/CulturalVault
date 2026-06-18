"use client";

import { useState } from "react";

export default function ContributePage() {
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

    const res = await fetch(
      "/api/contributions",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ...form,
          lat: Number(form.lat),
          lng: Number(form.lng),
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      }
    );

    if (!res.ok) {
      alert(
        "Failed to submit contribution"
      );
      return;
    }

    alert(
      "Contribution Submitted Successfully!"
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
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-3">
  🌍 Cultural Heritage Community Hub
         </h1>

        <p className="text-lg text-muted-foreground">
          Share cultural stories,
          traditions, festivals,
          folklore and heritage
          knowledge with the world.
        </p>
      </div>

      {/* Form Card */}
      <div className="border rounded-3xl p-8 bg-card">

        <h2 className="text-3xl font-bold mb-8">
  🏛 Submit Heritage Contribution
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <input
            placeholder="Region"
            value={form.region}
            onChange={(e) =>
              setForm({
                ...form,
                region: e.target.value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <input
            placeholder="Contributor Name"
            value={form.contributor}
            onChange={(e) =>
              setForm({
                ...form,
                contributor:
                  e.target.value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <input
            placeholder="Latitude"
            value={form.lat}
            onChange={(e) =>
              setForm({
                ...form,
                lat: e.target.value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <input
            placeholder="Longitude"
            value={form.lng}
            onChange={(e) =>
              setForm({
                ...form,
                lng: e.target.value,
              })
            }
            className="border p-4 rounded-xl"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-5">

  <input
    placeholder="Cultural Era (Ancient, Medieval, Colonial...)"
    value={form.culturalEra}
    onChange={(e) =>
      setForm({
        ...form,
        culturalEra: e.target.value,
      })
    }
    className="border p-4 rounded-xl"
  />

  <input
    placeholder="Source Type (Folklore, Festival, Ritual...)"
    value={form.sourceType}
    onChange={(e) =>
      setForm({
        ...form,
        sourceType: e.target.value,
      })
    }
    className="border p-4 rounded-xl"
  />

  <input
    placeholder="Preservation Status"
    value={form.preservationStatus}
    onChange={(e) =>
      setForm({
        ...form,
        preservationStatus: e.target.value,
      })
    }
    className="border p-4 rounded-xl"
  />

  <input
    placeholder="Importance Level (Low / Medium / High)"
    value={form.importanceLevel}
    onChange={(e) =>
      setForm({
        ...form,
        importanceLevel: e.target.value,
      })
    }
    className="border p-4 rounded-xl"
  />

</div>

<div className="mt-5">
  <label className="block mb-2 font-medium">
    Audio Narration
  </label>

  <input
    type="file"
    accept="audio/*"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          setForm((prev) => ({
            ...prev,
            audio: reader.result as string,
          }));
        };

        reader.readAsDataURL(file);
      }
    }}
    className="w-full border p-4 rounded-xl"
  />
</div>

        {/* Tags */}

        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value,
            })
          }
          className="w-full border p-4 rounded-xl mt-5"
        />

        {/* Description */}

        <textarea
          placeholder="Tell the complete cultural story, tradition, festival, folklore, oral history or heritage knowledge..."
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
          className="w-full border p-4 rounded-xl mt-5 min-h-[300px]"
        />

        {/* Image Upload */}

        <div className="mt-5">
          <label className="block mb-2 font-medium">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (file) {
                const reader =
                  new FileReader();

                reader.onload =
                  () => {
                    setForm(
                      (prev) => ({
                        ...prev,
                        image:
                          reader.result as string,
                      })
                    );
                  };

                reader.readAsDataURL(
                  file
                );
              }
            }}
            className="w-full border p-4 rounded-xl"
          />
        </div>

        {/* Preview */}

        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="mt-6 w-full h-[400px] object-cover rounded-2xl border"
          />
        )}

        {/* Button */}

        <button
          onClick={submitContribution}
          className="mt-8 bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600"
        >
          🚀 Submit Contribution
        </button>
      </div>

      {/* Thank You Section */}

      <div className="border rounded-3xl p-8 bg-card mt-10 text-center">
        <h3 className="text-3xl font-bold mb-4">
          🌍 Preserve Culture Together
        </h3>

        <p className="text-muted-foreground max-w-3xl mx-auto leading-8">
          Every contribution helps
          document cultural heritage,
          oral traditions, rituals,
          folklore, festivals and
          community memories for
          future generations. Your
          knowledge becomes part of
          the CulturalVault archive.
        </p>
      </div>
    </div>
  );
}