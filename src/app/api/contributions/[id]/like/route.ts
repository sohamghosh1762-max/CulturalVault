import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Contribution from "@/models/Contribution";

const MONGODB_URI =
  process.env.MONGODB_URI || "";

async function connectDB() {
  if (mongoose.connections[0].readyState)
    return;

  await mongoose.connect(
    MONGODB_URI
  );
}

export async function PATCH(
  request: Request,
  { params }: any
) {
  try {
    await connectDB();

    const contribution =
      await Contribution.findByIdAndUpdate(
        params.id,
        {
          $inc: {
            likes: 1,
          },
        },
        {
          new: true,
        }
      );

    return NextResponse.json(
      contribution
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}