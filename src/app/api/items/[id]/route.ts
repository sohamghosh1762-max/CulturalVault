import { NextRequest, NextResponse } from "next/server";
import { MOCK_ITEMS } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = MOCK_ITEMS.find((i) => i.id === id);

  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  return NextResponse.json({ data: item });
}
