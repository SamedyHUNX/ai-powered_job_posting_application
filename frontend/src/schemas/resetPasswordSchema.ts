import { z } from "zod";

export const createResetPasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      newPassword: z
        .string()
        .min(8, t("errors.passwordMinLength"))
        .regex(/[A-Z]/, t("errors.passwordUppercase"))
        .regex(/[a-z]/, t("errors.passwordLowercase"))
        .regex(/[0-9]/, t("errors.passwordNumber")),
      confirmPassword: z.string().min(1, t("errors.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("errors.passwordsDontMatch"),
      path: ["confirmPassword"],
    });
};

export type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};
