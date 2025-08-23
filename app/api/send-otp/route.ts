import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "app/lib/otpStore";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP with 5 min expiry
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  // Setup transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  // Send email
  await transporter.sendMail({
    from: `"Power Tools Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - OTP Code",
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
  });

  return NextResponse.json({ success: true, message: "OTP sent to email" });
}