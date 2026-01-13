import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Helper to get User ID from Cookie
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
  const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(tasks);
}

export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title } = await req.json();
  await connectDB();
  const task = await Task.create({ userId, title });
  return NextResponse.json(task, { status: 201 });
}

export async function DELETE(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectDB();
  await Task.findOneAndDelete({ _id: id, userId });
  return NextResponse.json({ message: "Deleted" });
}
