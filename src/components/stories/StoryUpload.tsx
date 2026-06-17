"use client";

import { useEffect, useState } from "react";

export default function StoryUpload() {
  const [editingId, setEditingId] =
    useState<number | null>(null);

const [story, setStory] = useState({
  title: "",
  region: "",
  language: "",
  narrator: "",
  category: "",
  score: "",
  lat: "",
  lng: "",
  description: "",
  audio: "",
  image: "",
  gallery: [],
});

  useEffect(() => {
    const editStory =
      localStorage.getItem("editStory");

    if (editStory) {
      const storyData = JSON.parse(editStory);

      setStory({
        title: storyData.title || "",
        region: storyData.region || "",
        language: storyData.language || "",
        narrator: storyData.narrator || "",
        category: storyData.category || "",
        score: String(storyData.score || ""),
        lat: String(storyData.lat || ""),
        lng: String(storyData.lng || ""),
        description: storyData.description || "",
        audio: storyData.audio || "",
        image: storyData.image || "",
        gallery: storyData.gallery || [],
      });

      setEditingId(storyData.id);
    }
  }, []);

  const saveStory = async () => {
    if (
      !story.title ||
      !story.region ||
      !story.language ||
      !story.narrator
    ) {
      alert("Please fill all required fields");
      return;
    }

    const stories = JSON.parse(
      localStorage.getItem("stories") || "[]"
    );

    if (editingId) {
      const updatedStories = stories.map(
        (item: any) =>
          item.id === editingId
            ? {
                ...story,
                id: editingId,
                score: Number(story.score),
                lat: Number(story.lat),
                lng: Number(story.lng),
              }
            : item
      );

      localStorage.setItem(
        "stories",
        JSON.stringify(updatedStories)
      );

      localStorage.removeItem("editStory");

      alert("Story Updated Successfully!");

      window.location.reload();
      return;
    }

    console.log("Story Data:", story);
    console.log("Gallery Images:", story.gallery);
    const response = await fetch("/api/stories", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: story.title,
    region: story.region,
    language: story.language,
    narrator: story.narrator,
    category: story.category,
    score: Number(story.score),
    lat: Number(story.lat),
    lng: Number(story.lng),
    description: story.description,
    audio: story.audio,
    image: story.image,
    gallery: story.gallery,
  }),
});

if (!response.ok) {
  alert("Failed to save story");
  return;
}

    window.dispatchEvent(
  new Event("storiesUpdated")
);

    alert("Story Saved Successfully!");

    setStory({
  title: "",
  region: "",
  language: "",
  narrator: "",
  category: "",
  score: "",
  lat: "",
  lng: "",
  description: "",
  audio: "",
  image: "",
  gallery: [],
});
  };

  return (
    <div className="border rounded-2xl p-6 bg-card">
      <h2 className="text-2xl font-bold mb-6">
        {editingId
          ? "Edit Story"
          : "Upload Story"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Story Title"
          value={story.title}
          onChange={(e) =>
            setStory({
              ...story,
              title: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Region"
          value={story.region}
          onChange={(e) =>
            setStory({
              ...story,
              region: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Language"
          value={story.language}
          onChange={(e) =>
            setStory({
              ...story,
              language: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Narrator"
          value={story.narrator}
          onChange={(e) =>
            setStory({
              ...story,
              narrator: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Story Category"
          value={story.category}
          onChange={(e) =>
            setStory({
              ...story,
              category: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Preservation Score (0-100)"
          value={story.score}
          onChange={(e) =>
            setStory({
              ...story,
              score: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          type="number"
          step="any"
          placeholder="Latitude"
          value={story.lat}
          onChange={(e) =>
            setStory({
              ...story,
              lat: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          type="number"
          step="any"
          placeholder="Longitude"
          value={story.lng}
          onChange={(e) =>
            setStory({
              ...story,
              lng: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />
      </div>

      <h3 className="font-semibold mt-5 mb-2">
      🎙 Audio Narration (Optional)
       </h3>

      <div className="mt-4">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              const reader = new FileReader();

              reader.onload = () => {
                setStory((prev) => ({
                  ...prev,
                  audio:
                    reader.result as string,
                }));
              };

              reader.readAsDataURL(file);
            }
          }}
          className="w-full border rounded-xl p-3"
        />
      </div>

      <h3 className="font-semibold mt-5 mb-2">
  🖼 Story Cover Image
</h3>

      <div className="mt-4">
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          setStory((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        };

        reader.readAsDataURL(file);
      }
    }}
    className="w-full border rounded-xl p-3"
  />
</div>


<h3 className="font-semibold mt-5 mb-2">
  📸 Story Gallery Images
</h3>

<div className="mt-4">
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(
        e.target.files || []
      );

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          setStory((prev: any) => ({
            ...prev,
            gallery: [
              ...prev.gallery,
              reader.result as string,
            ],
          }));
        };

        reader.readAsDataURL(file);
      });
    }}
    className="w-full border rounded-xl p-3"
  />
</div>

      <textarea
        placeholder="Story Description"
        value={story.description}
        onChange={(e) =>
          setStory({
            ...story,
            description: e.target.value,
          })
        }
        className="w-full border rounded-xl p-3 mt-4 min-h-[300px]"
        rows={12}
      />

      <button
        onClick={saveStory}
        className="mt-5 bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90"
      >
        {editingId
          ? "Update Story"
          : "Save Story"}
      </button>
    </div>
  );
}