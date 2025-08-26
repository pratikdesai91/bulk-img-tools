import { NextResponse } from "next/server";
import { otpStore } from "@/app/lib/otpStore";
import { updateUserPassword } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, otp, newPassword } = await req.json();

  if (!email || !otp || !newPassword)
    return NextResponse.json({ error: "All fields required" }, { status: 400 });

  const entry = otpStore.get(email);
  if (!entry || entry.expiresAt < Date.now())
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });

  if (entry.otp !== otp)
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

  otpStore.delete(email);

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(email, hashedPassword);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}