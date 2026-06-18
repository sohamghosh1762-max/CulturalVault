import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";

export async function GET() {
  try {
    await connectDB();

    const stories = await Story.find();

    return NextResponse.json(stories);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const story = await Story.create({
  userId: body.userId,
  userName: body.userName,

  title: body.title,
  region: body.region,
  language: body.language,
  narrator: body.narrator,
  category: body.category,
  score: body.score,
  lat: body.lat,
  lng: body.lng,
  description: body.description,
  audio: body.audio,
  image: body.image,
  gallery: body.gallery,
});

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save story" },
      { status: 500 }
    );
  }
}