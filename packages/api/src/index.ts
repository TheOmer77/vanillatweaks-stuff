import { Elysia } from 'elysia';
import router from './routes';
import { errorHandler, logResponseInfo } from './hooks/global';

const app = new Elysia();

app.onError(errorHandler);
app.onAfterHandle(logResponseInfo);

app.use(router);

app.listen(process.env.PORT || 3000, (server) =>
  console.log(`Server is running at ${server.hostname}:${server.port}`)
);
