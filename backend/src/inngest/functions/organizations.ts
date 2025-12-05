import { NonRetriableError } from 'inngest';
import { inngest } from '../inngest.client';

// export const clerkCreateOrganization = inngest.createFunction(
//   {
//     id: 'jobxhub/create-db-organization',
//     name: 'JobXHub - Create DB Organization',
//   },
//   {
//     event: 'jobxhub/organization.created',
//   },
//   async ({ event, step }) => {
//     await step.run('verify-webhook', async () => {
//       try {
//         verifyWebhook(event.data);
//       } catch {
//         throw new NonRetriableError('Invalid webhook');
//       }
//     });

//     await step.run('create-organization', async () => {
//       const orgData = event.data.data;

//       await 
//     });
//   },
// );
