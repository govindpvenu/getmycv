import {
  emailOTPClient,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  //you can pass client configuration here
  plugins: [
    emailOTPClient(),
    lastLoginMethodClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
