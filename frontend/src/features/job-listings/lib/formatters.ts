import {
  ExperienceLevel,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/types/job-listing.type";

export function formatWageInterval(interval: WageInterval) {
  switch (interval) {
    case "hourly":
      return "Hour";
    case "yearly":
      return "Year";
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
    case "mid-level":
      return "Mid-Level";
    case "senior":
      return "Senior";
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
    default:
      throw new Error(`Unknown job type: ${type satisfies never}`);
  }
}
