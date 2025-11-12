import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { authSchema } from "@/db/schemas";
import { emailOTP } from "better-auth/plugins/email-otp";
import { lastLoginMethod, username } from "better-auth/plugins";
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
    sendResetPassword: async ({ user, url, token }) => {
      console.log(`user: ${user}, url: ${url}, token: ${token}`);
      await sendEmail({
        email: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
      // Notify user
      await sendEmail({
        email: user.email,
        subject: "Your password was changed",
        text: `Password for user ${user.email} has been reset. If you didn't make this change, reset your password again and contact support.`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        console.log("profile:", profile);
        return {
          first_name: profile.name.split(" ")[0],
          last_name: profile.name.split(" ")[1],
          // username: profile.login,
        };
      },
    },
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        console.log("profile:", profile);
        return {
          first_name: profile.given_name,
          last_name: profile.family_name,
        };
      },
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
          await sendEmail({
            email,
            subject: "One-Time Password",
            text: `Your one-time password for sign-in is ${otp}`,
          });
        } else if (type === "email-verification") {
          await sendEmail({
            email,
            subject: "Email Verification",
            text: `Your one-time password for email verification is ${otp}`,
          });
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    username(),
    lastLoginMethod(),
    nextCookies(),
  ], // make sure this is the last plugin in the array
});

export type Session = typeof auth.$Infer.Session;
