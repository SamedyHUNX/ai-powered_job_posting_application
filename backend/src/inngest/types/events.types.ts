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

export type ResetPasswordRequestData = {
  email: string;
  resetUrl: string;
};

export type Events = {
  'jobxhub/user.created': {
    data: UserCreatedData;
  };
  'jobxhub/user.updated': {
    data: UserUpdatedData;
  };
  'jobxhub/user.reset_password_requested': {
    data: ResetPasswordRequestData;
  };
  'jobxhub/job.posted': {
    data: JobPostedData;
  };
};
