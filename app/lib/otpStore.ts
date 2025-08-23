import { User } from "@/types/user";

// Each OTP entry will be tied to an email
export interface OtpEntry {
  otp: string;
  expiresAt: number; // store expiry timestamp
  user?: User;       // optional user info during signup
}

// ✅ Strongly typed Map
export const otpStore: Map<string, OtpEntry> = new Map();