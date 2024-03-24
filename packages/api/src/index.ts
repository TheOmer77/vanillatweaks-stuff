import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import router from './routes';
import { handleError } from './middleware';

const app = new Hono();

app.onError(handleError);
// TODO
// app.onAfterHandle(logResponseInfo);

app.route('/', router);

serve(
  { fetch: app.fetch, port: Number(process.env.PORT) || 3000 },
  ({ address, port }) => console.log(`Server is running at ${address}:${port}`)
);
