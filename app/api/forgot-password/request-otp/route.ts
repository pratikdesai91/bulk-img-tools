import { NextResponse } from "next/server";
import { otpStore } from "@/app/lib/otpStore";
import { findUserByEmail } from "@/app/lib/db";
import { sendEmailOtp } from "@/app/lib/email";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await findUserByEmail(email);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min

  try {
    await sendEmailOtp(email, otp);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}