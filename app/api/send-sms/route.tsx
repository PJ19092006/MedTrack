import twilio from "twilio";

export async function POST(req: Request) {
  const { to, body } = (await req.json()) as { to: string; body: string };

  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

  try {
    const msg = await client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER!,
      body,
    });
    console.log(msg.body);

    return Response.json({ ok: true, sid: msg.sid, status: msg.status });
  } catch (err: any) {
    console.log("Failed to send SMS:", err);
    return Response.json(
      { ok: false, error: err?.message ?? "Failed to send" },
      { status: 500 }
    );
  }
}