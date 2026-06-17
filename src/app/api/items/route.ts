import { NextRequest, NextResponse } from "next/server";
import { MOCK_ITEMS } from "@/lib/mockData";
import { FilterState } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "All";
  const sortBy = (searchParams.get("sortBy") ?? "newest") as FilterState["sortBy"];
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "8");

  let items = [...MOCK_ITEMS];

  if (search.trim()) {
    const q = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (category !== "All") {
    items = items.filter((i) => i.category === category);
  }

  switch (sortBy) {
    case "newest": items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    case "oldest": items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
    case "rating": items.sort((a, b) => b.rating - a.rating); break;
    case "title": items.sort((a, b) => a.title.localeCompare(b.title)); break;
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    pagination: { page, limit, total },
  });
}
