"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  email,
  subject,
  text,
}: {
  email: string;
  subject: string;
  text: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM as string,
    to: [email],
    subject: subject,
    text: text,
  });

  if (error) {
    return {
      success: false,
      message: error?.message || "Failed to send email.",
      error: error,
    };
  }

  return {
    success: false,
    message: "Email sent successfully!",
    data: data,
  };
}

//For API route use this code
// Refer: https://resend.com/docs/send-with-nextjs

// import { EmailTemplate } from '@/components/email-template';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST() {
//   const { data, error } = await resend.emails.send({
//     from: 'onboarding@resend.dev',
//     to: 'delivered@resend.dev',
//     subject: 'Hello world',
//     react: EmailTemplate({ firstName: 'John' }),
//   });

//   if (error) {
//     return Response.json({ error });
//   }

//   return Response.json(data);
// }
