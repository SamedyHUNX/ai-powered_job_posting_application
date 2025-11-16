import { z } from "zod";

export const createSignUpSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("clientErrors.nameRequired")),
    firstName: z.string().min(1, t("clientErrors.firstNameRequired")),
    lastName: z.string().min(1, t("clientErrors.lastNameRequired")),
    email: z.string().email(t("clientErrors.invalidEmail")),
    password: z.string().min(8, t("clientErrors.passwordMinLength")),
    image: z
      .any()
      .refine((file) => file instanceof File, t("clientErrors.imageRequired")),
  });
};

export type SignUpFormData = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: File;
};
