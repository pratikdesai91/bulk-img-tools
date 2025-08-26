import { NextResponse } from "next/server";
import { otpStore } from "app/lib/otpStore";

export async function POST(req: Request) {
  const { mobile, otp } = await req.json(); // ✅ use mobile

  const entry = otpStore.get(mobile); // ✅ lookup by mobile

  if (!entry || entry.expiresAt < Date.now()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  if (entry.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  // OTP valid → remove from store
  otpStore.delete(mobile);

  return NextResponse.json({ success: true });
}