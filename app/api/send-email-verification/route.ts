import EmailVerification from "@/emails/email-verification";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Payload = { email: string; otp: string };

export async function POST(req: Request) {
  const { email, otp } = (await req.json()) as Payload;

  if (!email || !otp) {
    return Response.json(
      { error: "Email and OTP are required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Govind P Venu <developer@govindpvenu.me>",
      to: [email],
      subject: "Email Verification",
      react: EmailVerification({ verificationCode: otp }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
