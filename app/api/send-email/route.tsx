import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { to, message } = await req.json();

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: "Vaccine Reminder",
    html: `<p>${message}</p>`,
  });

  return Response.json({ success: true });
}