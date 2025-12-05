import { inngest } from '../inngest.client';

export const createOrganization = inngest.createFunction(
  {
    id: 'jobxhub/create-db-organization',
    name: 'JobXHub - Create DB Organization',
  },
  {
    event: 'jobxhub/organization.created',
  },
  async ({ event, step }) => {
    await step.run('create-organization', async () => {
      const orgData = event.data;

      // Implement later
    });
  },
);
