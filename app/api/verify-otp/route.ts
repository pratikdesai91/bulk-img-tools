import { NextResponse } from "next/server";
import { otpStore } from "@/app/lib/otpStore";
import { createUser } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, otp, firstName, lastName, password } = await req.json();

  const entry = otpStore.get(email);

  if (!entry || entry.expiresAt < Date.now()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  if (entry.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  otpStore.delete(email);

  try {
    // 🔒 hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ save user to Vercel Postgres
    const user = await createUser({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}