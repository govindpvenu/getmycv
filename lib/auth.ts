import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { authSchema } from "@/db/schemas";
import { emailOTP } from "better-auth/plugins/email-otp";
import { lastLoginMethod } from "better-auth/plugins";
import { sendEmail } from "@/actions/sendEmail";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      ...authSchema,
    },
  }),
  user: {
    additionalFields: {
      first_name: {
        type: "string",
        required: true,
      },
      last_name: {
        type: "string",
        required: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(`user: ${user}, url: ${url}, token: ${token}`);
      // await sendEmail({
      //   to: user.email,
      //   subject: "Reset your password",
      //   text: `Click the link to reset your password: ${url}`,
      // });
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);

      // Notify user
      // sendSecurityEmail({
      //   to: user.email,
      //   subject: "Your password was changed",
      //   text:
      //     "If you didn’t make this change, reset your password again and contact support.",
      // }),
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: false,
      disableSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`Sending OTP: ${otp}, to ${email},for ${type}`);
        if (type === "sign-in") {
          await sendEmail({ email, otp });
          await sendEmailVerification(email, otp);
        } else if (type === "email-verification") {
          //This is from resend.
          await sendEmailVerification(email, otp);
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    lastLoginMethod(),
    nextCookies(),
  ], // make sure this is the last plugin in the array
});

async function sendEmailVerification(email: string, otp: string) {
  try {
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/send-email-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send email verification: ${
          errorData.error || response.statusText
        }`
      );
    }

    const result = await response.json();
    console.log("Email verification sent successfully:", result);
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
}
export type Session = typeof auth.$Infer.Session;
