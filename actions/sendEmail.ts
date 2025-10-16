"use server";

import nodemailer from "nodemailer";

export async function sendEmail(data: { email: string; otp: string }) {
  const { email, otp } = data;

  // sanity checks (optional but helpful)
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_PORT } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    console.error("Missing SMTP env vars");
    return {
      success: false,
      message: "Server email configuration incomplete.",
    };
  }
  const port = Number(SMTP_PORT || 465);
  const secure = port === 465; // true for 465, false for 587

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST, // e.g. "smtp.gmail.com"
    port, // 465 or 587
    secure, // true for 465
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS, // app password (not regular password)
    },
  });

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM, // "Your Name <your@gmail.com>"
      to: email,
      subject: "One-Time Password",
      text: `Your one-time password is ${otp}`,
    });

    return {
      success: true,
      message: "Email sent successfully!",
      id: info.messageId,
    };
  } catch (error: any) {
    console.error("SMTP error:", error);
    return {
      success: false,
      message: error?.message || "Failed to send email.",
    };
  }
}

//For API route use this code

//// app/api/send/route.ts
// import nodemailer from "nodemailer";

// type Payload = { email: string; otp: string };

// export async function POST(req: Request) {
//   try {
//     const { email, otp } = (await req.json()) as Payload;

//     if (!email || !otp) {
//       return Response.json(
//         { ok: false, message: "Missing email or otp" },
//         { status: 400 }
//       );
//     }

//     // Env checks
//     const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
//     if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
//       console.error("Missing SMTP env vars");
//       return Response.json(
//         { ok: false, message: "Server email configuration incomplete." },
//         { status: 500 }
//       );
//     }

//     const port = Number(SMTP_PORT || 465);
//     const secure = port === 465; // 465 -> SSL/TLS, 587 -> STARTTLS

//     const transporter = nodemailer.createTransport({
//       host: SMTP_HOST, // e.g., "smtp.gmail.com"
//       port,
//       secure,
//       auth: { user: SMTP_USER, pass: SMTP_PASS },
//     });

//     const info = await transporter.sendMail({
//       from: SMTP_FROM,           // "Your Name <you@gmail.com>"
//       to: email,                 // recipient
//       subject: "One-Time Password",
//       text: `Your one-time password is ${otp}`,
//       // html: `<p>Your one-time password is <b>${otp}</b></p>`, // optional
//     });

//     return Response.json({
//       ok: true,
//       message: "Email sent successfully!",
//       id: info.messageId,
//     });
//   } catch (err: any) {
//     console.error("SMTP error:", err);
//     return Response.json(
//       { ok: false, message: err?.message ?? "Failed to send email." },
//       { status: 500 }
//     );
//     }
// }

// // from a Client Component / form submit
// await fetch("/api/send", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ email: "user@example.com", otp: "123456" }),
// });
