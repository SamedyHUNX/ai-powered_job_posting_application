// src/inngest/inngest.client.ts
import { EventSchemas, Inngest } from 'inngest';
import { Events } from './types/events.types';

export const inngest = new Inngest({
  id: 'job-posting',
  schemas: new EventSchemas().fromRecord<Events>(),
  eventKey: process.env.INNGEST_EVENT_KEY,
});
