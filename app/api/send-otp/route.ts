import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "@/app/lib/otpStore";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP (5 min expiry)
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}