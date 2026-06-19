import mongoose from "mongoose";

const ContributionSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        default: "",
      },

      title: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },

      region: {
        type: String,
        required: true,
      },

      contributor: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },

      audio: {
        type: String,
        default: "",
      },

      lat: {
        type: Number,
        default: 0,
      },

      lng: {
        type: Number,
        default: 0,
      },

      tags: {
        type: [String],
        default: [],
      },

      /* Heritage Information */

      culturalEra: {
        type: String,
        default: "",
      },

      sourceType: {
        type: String,
        default: "",
      },

      preservationStatus: {
        type: String,
        default: "Active",
      },

      importanceLevel: {
        type: String,
        default: "",
      },

      heritageScore: {
        type: Number,
        default: 75,
      },

      /* Community Features */

      likes: {
        type: Number,
        default: 0,
      },

      views: {
        type: Number,
        default: 0,
      },

      shares: {
        type: Number,
        default: 0,
      },

      inspiringVotes: {
        type: Number,
        default: 0,
      },

      heritageVotes: {
        type: Number,
        default: 0,
      },

      badge: {
        type: String,
        default: "Explorer",
      },

      verified: {
        type: Boolean,
        default: false,
      },

      featured: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        default: "Pending Review",
      },

      /* References */

      references: {
        type: [String],
        default: [],
      },

      gallery: {
        type: [String],
        default: [],
      },

      /* Future Community Features */

      commentsCount: {
        type: Number,
        default: 0,
      },

      bookmarks: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Contribution ||
  mongoose.model(
    "Contribution",
    ContributionSchema
  );