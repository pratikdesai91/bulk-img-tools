type OtpEntry = {
  otp: string;
  expiresAt: number;
};

export const otpStore = new Map<string, OtpEntry>();