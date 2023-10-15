import { Elysia } from 'elysia';
import router from './routes';
import { errorHandler, logResponseInfo } from './hooks/global';

const app = new Elysia();

app.onError(errorHandler);
app.onAfterHandle(logResponseInfo);

app.use(router);

app.listen(3000, () =>
  console.log(
    `Server is running at ${app.server?.hostname}:${app.server?.port}`
  )
);
