import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Contribution from "@/models/Contribution";

const MONGODB_URI =
  process.env.MONGODB_URI || "";

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

/* GET ALL CONTRIBUTIONS */

export async function GET() {
  try {
    await connectDB();

    const contributions =
      await Contribution.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      contributions
    );
  } catch (error) {
    console.error("Mongo Error:", error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch contributions",
      },
      {
        status: 500,
      }
    );
  }
}

/* CREATE CONTRIBUTION */

export async function POST(
  request: Request
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const contribution =
      await Contribution.create({
        title: body.title,
        category: body.category,
        region: body.region,

        contributor:
          body.contributor || "",

        description:
          body.description || "",

        image:
          body.image || "",

        audio:
          body.audio || "",

        lat:
          body.lat || 0,

        lng:
          body.lng || 0,

        tags:
          body.tags || [],

        culturalEra:
          body.culturalEra || "",

        sourceType:
          body.sourceType || "",

        preservationStatus:
          body.preservationStatus ||
          "Active",

        importanceLevel:
          body.importanceLevel || "",

        heritageScore: 75,

        badge: "Explorer",

        inspiringVotes: 0,

        heritageVotes: 0,

        likes: 0,

        views: 0,

        verified: false,

        featured: false,

        status:
          "Pending Review",
      });

    return NextResponse.json(
      contribution,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to create contribution",
      },
      {
        status: 500,
      }
    );
  }
}