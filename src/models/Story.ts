import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
    // Owner Information
    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    // Story Information
    title: {
      type: String,
      required: true,
    },

    region: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    narrator: {
      type: String,
      required: true,
    },

    category: String,

    score: {
      type: Number,
      default: 0,
    },

    lat: Number,

    lng: Number,

    description: String,

    // Media
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