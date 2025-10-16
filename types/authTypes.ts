export type Stage = {
  stage:
    | "sign-up"
    | "sign-in"
    | "email-verification"
    | "forgot-password"
    | "reset-password";
  email: string;
};
