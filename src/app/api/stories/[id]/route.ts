import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const updatedStory = await Story.findByIdAndUpdate(
      params.id,
      {
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
      },
      { new: true }
    );

    if (!updatedStory) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStory);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update story: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deletedStory = await Story.findByIdAndDelete(params.id);

    if (!deletedStory) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Story deleted successfully" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete story: " + error.message },
      { status: 500 }
    );
  }
}
