import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { serve } from 'inngest/express';
import { inngest } from './inngest.client';
import { createUser } from './functions/auth';

@Controller('api/inngest')
export class InngestController {
  @All()
  async handleInngest(@Req() req: Request, @Res() res: Response) {
    const handler = serve({
      client: inngest,
      functions: [
        createUser,
        // more functions
      ],
    });
    await handler(req, res);
  }
}
