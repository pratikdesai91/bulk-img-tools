import { Resend } from "resend";

type Body = {
  rating: number;
  message: string;
  page?: string;
  url?: string;
  userAgent?: string;
};

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Partial<Body>;

    const rating = Number(data.rating ?? 0);
    const message = String(data.message ?? "").trim();
    const page = String(data.page ?? "unknown");
    const url = String(data.url ?? "");
    const userAgent = String(data.userAgent ?? "");

    if (!process.env.RESEND_API_KEY || !process.env.FEEDBACK_TO_EMAIL || !process.env.FEEDBACK_FROM_EMAIL) {
      return new Response(JSON.stringify({ error: "Email env not configured" }), { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const subject = `New Feedback (${rating}★) — ${page}`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial;">
        <h2>New Feedback</h2>
        <p><b>Rating:</b> ${"⭐".repeat(Math.min(5, Math.max(0, rating)))}</p>
        <p><b>Message:</b><br/>${message ? message.replace(/\n/g, "<br/>") : "<i>(no message)</i>"}</p>
        <hr/>
        <p><b>Page:</b> ${page}</p>
        <p><b>URL:</b> ${url}</p>
        <p><b>User-Agent:</b> ${userAgent}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </div>
    `;

    await resend.emails.send({
      from: process.env.FEEDBACK_FROM_EMAIL,
      to: process.env.FEEDBACK_TO_EMAIL,
      subject,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Feedback email error:", err);
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
  }
}
