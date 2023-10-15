import { Elysia, ErrorHandler } from 'elysia';
import router from './routes';

const errorHandler: ErrorHandler = ({
  error,
  set,
  code,
  path,
  request: { method },
}) => {
  switch (code) {
    case 'VALIDATION':
      set.status = 400;
      break;
    case 'PARSE':
    case 'INVALID_COOKIE_SIGNATURE':
      set.status = 401;
      break;
    case 'NOT_FOUND':
      set.status = 404;
      break;
    default:
      set.status = 500;
  }

  console.error(method, path, set.status);
  error.stack && console.error(error.stack);

  return { success: false, message: error.message };
};

const app = new Elysia();

app.onError(errorHandler);

app.use(router);

app.listen(3000, () =>
  console.log(
    `Server is running at ${app.server?.hostname}:${app.server?.port}`
  )
);
