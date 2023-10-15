import { Elysia } from 'elysia';
import router from './routes';

const app = new Elysia();

app.use(router);

app.listen(3000, () =>
  console.log(
    `Server is running at ${app.server?.hostname}:${app.server?.port}`
  )
);
