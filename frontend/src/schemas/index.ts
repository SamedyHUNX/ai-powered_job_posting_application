import { experienceLevels, jobListingTypes, wageIntervals } from "@/types";
import { z } from "zod";

// ============================================================================
// Authentication Schemas
// ============================================================================

/**
 * Sign In Schema
 */
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

/**
 * Sign Up Schema
 */
export const createSignUpSchema = (t: (key: string) => string) => {
  return z.object({
    username: z.string().min(1, t("nameRequired")),
    firstName: z.string().min(1, t("firstNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(8, t("passwordMinLength")),
    image: z.any().refine((file) => file instanceof File, t("imageRequired")),
  });
};

export type SignUpFormData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: File;
};

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email(t("invalidEmail")),
  });
};

export type ForgotPasswordSchemaData = {
  email: string;
};

/**
 * Reset Password Schema
 */
export const createResetPasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      newPassword: z
        .string()
        .min(8, t("passwordMinLength"))
        .regex(/[A-Z]/, t("passwordUppercase"))
        .regex(/[a-z]/, t("passwordLowercase"))
        .regex(/[0-9]/, t("passwordNumber")),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });
};

export type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

// ============================================================================
// Organization Schemas
// ============================================================================

/**
 * Create Organization Schema
 */
export const createOrganizationSchema = (t: (key: string) => string) => {
  return z.object({
    orgName: z.string().min(1, t("organizationNameRequired")),
    slug: z.string().min(1, t("slugRequired")),
    image: z.any().refine((file) => file instanceof File, t("imageRequired")),
  });
};

export type CreateOrganizationFormData = {
  orgName: string;
  image: File;
};

// ============================================================================
// Job Listing Schemas
// ============================================================================

/**
 * Create Job Listing Schema
 */
export const createJobListingSchema = (t: (key: string) => string) => {
  return z
    .object({
      organizationId: z.string().min(1),
      title: z.string().min(1, t("jobTitleRequired")),
      description: z.string().min(1, t("jobDescriptionMinLength")),
      experienceLevel: z.enum(experienceLevels, {
        message: t("experienceLevelRequired"),
      }),
      wage: z
        .number()
        .optional()
        .nullable()
        .transform((val) => val ?? undefined),
      wageInterval: z
        .enum(wageIntervals)
        .optional()
        .nullable()
        .transform((val) => val ?? undefined),
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
