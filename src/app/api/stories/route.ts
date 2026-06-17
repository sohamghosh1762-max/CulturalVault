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

    const story = await Story.create(body);

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save story" },
      { status: 500 }
    );
  }
}