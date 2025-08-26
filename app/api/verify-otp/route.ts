import { NextResponse } from "next/server";
import { otpStore } from "@/app/lib/otpStore";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const entry = otpStore.get(email);

    if (!entry || entry.expiresAt < Date.now()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (entry.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    otpStore.delete(email);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}