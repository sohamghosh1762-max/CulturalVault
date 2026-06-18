import mongoose from "mongoose";

const ArticleSchema =
  new mongoose.Schema(
    {
      title: String,

      category: String,

      excerpt: String,

      content: String,

      coverImage: String,

      author: String,

      tags: [String],

      readTime: String,

      featured: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Article ||
  mongoose.model(
    "Article",
    ArticleSchema
  );