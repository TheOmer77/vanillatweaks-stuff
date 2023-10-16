import type { ErrorHandler, Handler } from 'elysia';

export const logResponseInfo: Handler = ({ set, path, request: { method } }) =>
  console.log(method, path, set.status?.toString() || '');

export const errorHandler: ErrorHandler = ({
  error,
  set,
  code,
  path,
  request: { method },
}) => {
  switch (code) {
    case 'PARSE':
    case 'VALIDATION':
      set.status = 400;
      break;
    case 'INVALID_COOKIE_SIGNATURE':
      set.status = 401;
      break;
    case 'NOT_FOUND':
      set.status = 404;
      break;
    default:
      set.status = 500;
  }

  console.error(method, path, set.status.toString());
  error.stack && console.error(error.stack);

  return { success: false, message: error.message };
};
