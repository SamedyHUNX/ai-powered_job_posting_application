// src/inngest/types/events.types.ts
export type UserCreatedData = {
  userId: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
};

export type UserUpdatedData = {
  userId: string;
  fields: Partial<UserCreatedData>;
};

export type JobPostedData = {
  jobId: string;
  userId: string;
  title: string;
  description: string;
  salary?: number;
};

export type Events = {
  'job-posting/user.created': {
    data: UserCreatedData;
  };
  'job-posting/user.updated': {
    data: UserUpdatedData;
  };
  'job-posting/job.posted': {
    data: JobPostedData;
  };
};
