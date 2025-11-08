import { inngest } from '../inngest.client';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    console.log('Event received:', event);

    await step.run('process-data', async () => {
      // Your business logic here
      return { message: 'Hello from Inngest!' };
    });

    return { success: true };
  },
);
