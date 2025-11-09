import { inngest } from '../inngest.client';

export const createUser = inngest.createFunction(
  { id: 'job-posting/create-db-user', name: 'JobPosting - Create DB User' },
  { event: 'job-posting/user.created' },
  async ({ event, step }) => {
    const { userId, email, name, firstName, lastName, imageUrl } = event.data;

    await step.run('send-welcome-email', async () => {
      console.log(`Sending welcome email to ${email}`);

      return { emailSent: true };
    });

    await step.run('create-user-profile', async () => {
      console.log(`Creating profile for user ${userId}`);
      // userId is typed as string
      return { profileCreated: true };
    });

    return {
      success: true,
      userId,
    };
  },
);
