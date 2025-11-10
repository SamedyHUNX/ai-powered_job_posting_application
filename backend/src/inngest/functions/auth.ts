import { inngest } from '../inngest.client';
import { EmailService } from './../../email/email.service';

export const createUser = inngest.createFunction(
  { id: 'job-posting/create-db-user', name: 'JobPosting - Create DB User' },
  { event: 'job-posting/user.created' },
  async ({ event, step }) => {
    const { userId, email, name, lastName } = event.data;
    const emailService = new EmailService();

    await step.run('send-welcome-email', async () => {
      await emailService.sendWelcomeEmail(email, lastName || name);

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
