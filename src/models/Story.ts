import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
    title: String,
    region: String,
    language: String,
    narrator: String,
    category: String,
    score: Number,
    lat: Number,
    lng: Number,
    description: String,
    audio: String,
    image: String,
    gallery: [String],

  },
  {
    timestamps: true,
  }
);

export default
  mongoose.models.Story ||
  mongoose.model("Story", StorySchema);