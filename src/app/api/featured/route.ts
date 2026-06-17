import { NextResponse } from "next/server";
import { MOCK_ITEMS } from "@/lib/mockData";

export async function GET() {
  const featured = MOCK_ITEMS.filter((i) => i.featured).slice(0, 4);
  return NextResponse.json({ data: featured });
}
