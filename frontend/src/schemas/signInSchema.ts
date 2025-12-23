import { z } from "zod";

export const createSignInSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(1, t("passwordRequired")),
  });
};

export type SignInFormData = {
  email: string;
  password: string;
};
