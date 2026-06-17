import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Mock validation
    if (email === "demo@culturalvault.com" && password === "password123") {
      return NextResponse.json({
        user: { id: "u1", name: "Demo User", email },
        token: "mock-jwt-token-7a8b9c",
      });
    }

    // Success for any valid inputs
    if (email && password.length >= 6) {
      return NextResponse.json({
        user: { id: Date.now().toString(), name: email.split("@")[0], email },
        token: "mock-jwt-token-success",
      });
    }

    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
