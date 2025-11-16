import { inngest } from '../inngest.client';
import { EmailService } from '@/email/email.service';

export const createUser = inngest.createFunction(
  { id: 'jobxhub/create-db-user', name: 'JobXHub - Create DB User' },
  { event: 'jobxhub/user.created' },
  async ({ event, step }) => {
    const { userId, email, name, lastName, acceptLanguage } = event.data;
    const emailService = new EmailService();

    await step.run('send-welcome-email', async () => {
      await emailService.sendWelcomeEmail(
        email,
        lastName || name,
        acceptLanguage,
      );

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

export const forgotPassword = inngest.createFunction(
  {
    id: 'jobxhub/user.reset_password_requested',
    name: 'JobXHub - Handle Password Reset Request',
  },
  { event: 'jobxhub/user.reset_password_requested' },
  async ({ event, step }) => {
    const { email, resetUrl, acceptLanguage } = event.data;
    const emailService = new EmailService();

    await step.run('send-password-reset-email', async () => {
      await emailService.sendPasswordResetEmail(
        email,
        resetUrl,
        acceptLanguage,
      );

      return { emailSent: true };
    });

    return {
      success: true,
      email,
    };
  },
);
