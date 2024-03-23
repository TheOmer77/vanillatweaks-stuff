import { type ErrorHandler, type Handler } from 'elysia';
import { HttpError } from 'core';

export const logResponseInfo: Handler = ({ set, path, request: { method } }) =>
  console.log(method, path, set.status?.toString() || '');

export const errorHandler: ErrorHandler = ({
  error,
  set,
  code,
  path,
  request: { method },
}) => {
  set.status =
    error instanceof HttpError
      ? error.status
      : code === 'VALIDATION'
        ? 400
        : 500;

  console.error(method, path, set.status.toString());
  error.stack && console.error(error.stack);

  return { success: false, message: error.message };
};
