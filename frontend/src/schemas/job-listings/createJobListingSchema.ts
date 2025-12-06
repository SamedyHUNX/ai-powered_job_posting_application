import { z } from "zod";

export const wageIntervals = ["hourly", "yearly"] as const;
export const locationRequirements = ["in-office", "hybrid", "remote"] as const;
export const experienceLevels = ["junior", "mid-level", "senior"] as const;
export const jobListingStatuses = ["draft", "published", "delisted"] as const;
export const jobListingTypes = [
  "internship",
  "part-time",
  "full-time",
] as const;

// type WageInterval = (typeof wageIntervals)[number];
// type LocationRequirement = (typeof locationRequirements)[number];
// type ExperienceLevel = (typeof experienceLevels)[number];
// type JobListingStatus = (typeof jobListingStatuses)[number];
// type JobListingType = (typeof jobListingTypes)[number];

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
