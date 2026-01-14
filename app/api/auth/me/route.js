import connectDB from "@/lib/db";
import User from "@/models/User";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Helper: Get User ID from Token
async function getUserId(req) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId;
  } catch (e) {
    return null;
  }
}

export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(userId).select("-password");
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PUT(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // 1. We ONLY extract 'name' and 'gender'. We intentionally ignore 'email'.
    const { name, gender } = await req.json();

    // 2. Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 chars" },
        { status: 400 }
      );
    }

    const validGenders = ["male", "female", "other", "prefer_not_to_say"];
    if (gender && !validGenders.includes(gender)) {
      return NextResponse.json(
        { error: "Invalid gender selection" },
        { status: 400 }
      );
    }

    await connectDB();

    // 3. Update ONLY name and gender. Email is excluded from this object.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, gender },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
