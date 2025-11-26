import { z } from "zod";

export const createOrganizationSchema = (t: (key: string) => string) => {
  return z.object({
    orgName: z.string().min(1, t("organizationNameRequired")),
    image: z.any().refine((file) => file instanceof File, t("imageRequired")),
  });
};

export type CreateOrganizationFormData = {
  orgName: string;
  image: File;
};
