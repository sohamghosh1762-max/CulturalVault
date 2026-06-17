import { NextRequest, NextResponse } from "next/server";
import { MOCK_ITEMS } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const category = searchParams.get("category");

  if (!id || !category) {
    return NextResponse.json(
      { error: "Missing id or category parameters" },
      { status: 400 }
    );
  }

  const related = MOCK_ITEMS.filter(
    (i) => i.id !== id && i.category === category
  ).slice(0, 3);

  return NextResponse.json({ data: related });
}
