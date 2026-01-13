import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    // Create JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json({ message: "Login successful" });

    // Set HTTP-Only Cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
