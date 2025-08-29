// app/api/feedback/route.ts
export const runtime = "nodejs"; // ✅ required for Nodemailer (not Edge)

import nodemailer, { type SentMessageInfo } from "nodemailer";

type Body = {
  rating?: number;
  message?: string;
  page?: string;
  url?: string;
  userAgent?: string;
};

export async function POST(req: Request) {
  try {
    // Parse + normalize body
    const raw = await req.json().catch(() => ({}));
    const data = raw as Partial<Body>;
    const rating = Number.isFinite(Number(data.rating)) ? Number(data.rating) : 0;
    const message = (data.message ?? "").toString().trim();
    const page = (data.page ?? "unknown").toString();
    const url = (data.url ?? "").toString();
    const userAgent = (data.userAgent ?? "").toString();

    // Load envs
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      SMTP_SECURE,
      FEEDBACK_TO_EMAIL,
      FEEDBACK_FROM_EMAIL,
    } = process.env;

    const missing = [
      !SMTP_HOST ? "SMTP_HOST" : null,
      !SMTP_PORT ? "SMTP_PORT" : null,
      !SMTP_USER ? "SMTP_USER" : null,
      !SMTP_PASS ? "SMTP_PASS" : null,
      !FEEDBACK_TO_EMAIL ? "FEEDBACK_TO_EMAIL" : null,
      !FEEDBACK_FROM_EMAIL ? "FEEDBACK_FROM_EMAIL" : null,
    ].filter((v): v is string => v !== null);

    if (missing.length) {
      return new Response(
        JSON.stringify({ error: `Missing env: ${missing.join(", ")}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "true", // true for 465, false for 587
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const stars = "⭐".repeat(Math.max(0, Math.min(5, rating)));
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial;">
        <h2>New Feedback</h2>
        <p><b>Rating:</b> ${stars || "(none)"} </p>
        <p><b>Message:</b><br/>${message ? message.replace(/\n/g, "<br/>") : "<i>(no message)</i>"}</p>
        <hr/>
        <p><b>Page:</b> ${page}</p>
        <p><b>URL:</b> ${url}</p>
        <p><b>User-Agent:</b> ${userAgent}</p>
        <p><b>Time:</b> ${new Date().toISOString()}</p>
      </div>
    `;

    const info: SentMessageInfo = await transporter.sendMail({
      from: FEEDBACK_FROM_EMAIL, // For Gmail, this should match the authenticated user/domain
      to: FEEDBACK_TO_EMAIL,
      subject: `New Feedback (${rating}★) — ${page}`,
      html,
    });

    return new Response(JSON.stringify({ ok: true, id: info.messageId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("Feedback email error:", detail);
    return new Response(JSON.stringify({ error: "Failed to send email", detail }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}