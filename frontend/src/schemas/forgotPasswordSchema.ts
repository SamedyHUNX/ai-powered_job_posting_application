import { z } from "zod";

export const forgotPasswordSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email(t("invalidEmail")),
  });
};

export type ForgotPasswordSchemaData = {
  email: string;
};
