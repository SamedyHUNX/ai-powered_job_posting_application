import {
  experienceLevels,
  jobListingTypes,
  wageIntervals,
} from "@/types/job-listing.type";
import { z } from "zod";

export const createJobListingSchema = (t: (key: string) => string) => {
  return z
    .object({
      title: z.string().min(1, t("jobTitleRequired")),
      description: z.string().min(1, t("jobDescriptionMinLength")),
      experienceLevel: z.enum(experienceLevels, {
        message: t("experienceLevelRequired"),
      }),
      wage: z.number().optional().nullable(),
      wageInterval: z.enum(wageIntervals).optional().nullable(),
      type: z.enum(jobListingTypes, {
        message: t("jobTypeRequired"),
      }),
      stateAbbreviation: z
        .string()
        .transform((val) => (val.trim() === "" ? null : val))
        .nullable(),
      city: z
        .string()
        .transform((val) => (val.trim() === "" ? null : val))
        .optional()
        .nullable(),
      locationRequirement: z.enum(["in-office", "hybrid", "remote"], {
        message: t("locationRequirementRequired"),
      }),
    })
    .refine(
      (listing) => {
        return listing.locationRequirement === "remote" || listing.city != null;
      },
      {
        message: t("nonRemoteRequired"),
        path: ["city"],
      }
    )
    .refine(
      (listing) => {
        return (
          listing.locationRequirement === "remote" ||
          listing.stateAbbreviation != null
        );
      },
      {
        message: t("nonRemoteRequired"),
        path: ["stateAbbreviation"],
      }
    );
};

export type CreateJobListingFormData = z.infer<
  ReturnType<typeof createJobListingSchema>
>;
