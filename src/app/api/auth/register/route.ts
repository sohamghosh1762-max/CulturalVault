import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Mock successful database user creation
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: Date.now().toString(), name, email },
        token: "mock-jwt-token-" + Date.now().toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed." },
      { status: 500 }
    );
  }
}
