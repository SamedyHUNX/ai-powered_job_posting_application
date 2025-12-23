import { z } from "zod";

export const createSignUpSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("nameRequired")),
    firstName: z.string().min(1, t("firstNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(8, t("passwordMinLength")),
    image: z.any().refine((file) => file instanceof File, t("imageRequired")),
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
