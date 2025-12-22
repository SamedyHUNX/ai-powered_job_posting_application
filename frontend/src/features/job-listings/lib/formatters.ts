import {
  ExperienceLevel,
  JobListingStatus,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/types";

export function formatWageInterval(interval: WageInterval) {
  switch (interval) {
    case "hourly":
      return "Hourly";
    case "yearly":
      return "Yearly";
    case "monthly":
      return "Monthly";
    default:
      throw new Error(`Invalid wage interval: ${interval satisfies never}`);
  }
}

export function formatLocationRequirement(
  locationRequirement: LocationRequirement
) {
  switch (locationRequirement) {
    case "remote":
      return "Remote";
    case "in-office":
      return "In Office";
    case "hybrid":
      return "Hybrid";
    default:
      throw new Error(
        `Unknown location requirement: ${locationRequirement satisfies never}`
      );
  }
}

export function formatExperienceLevel(experienceLevel: ExperienceLevel) {
  switch (experienceLevel) {
    case "junior":
      return "Junior";
    case "mid":
      return "Mid-Level";
    case "senior":
      return "Senior";
    case "lead":
      return "Lead";
    case "manager":
      return "Manager";
    case "ceo":
      return "CEO";
    case "director":
      return "Director";
    default:
      throw new Error(
        `Unknown experience level: ${experienceLevel satisfies never}`
      );
  }
}

export function formatJobType(type: JobListingType) {
  switch (type) {
    case "internship":
      return "Internship";
    case "part-time":
      return "Part-Time";
    case "full-time":
      return "Full-Time";
    case "contract":
      return "Contract";
    case "freelance":
      return "Freelance";
    default:
      throw new Error(`Unknown job type: ${type satisfies never}`);
  }
}

export function formatJobListingStatus(status: JobListingStatus) {
  switch (status) {
    case "draft":
      return "Draft";
    case "published":
      return "Active";
    case "delisted":
      return "Delisted";
    default:
      throw new Error(`Unknown job listing status: ${status satisfies never}`);
  }
}
