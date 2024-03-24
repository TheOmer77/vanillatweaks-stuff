import type { Env, ErrorHandler, MiddlewareHandler } from 'hono';
import { type Hook } from '@hono/zod-validator';

import { HttpError } from 'core';

export const logResponseInfo: MiddlewareHandler = async (ctx, next) => {
  await next();
  const { method, path } = ctx.req,
    { ok, status } = ctx.res;
  if (ok) console.log(method, path, status.toString());
};

export const handleValidationError: Hook<unknown, Env, string> = (
  result,
  ctx
) => {
  const { method, path } = ctx.req,
    status = 400;
  if (!result.success) {
    console.error(method, path, status.toString());
    result.error.stack && console.error(result.error.stack);

    return ctx.json(
      { success: result.success, message: result.error.errors[0].message },
      400
    );
  }
};

export const handleError: ErrorHandler = (error, ctx) => {
  const status = error instanceof HttpError ? error.status : 500;

  const { method, path } = ctx.req;
  console.error(method, path, status.toString());
  error.stack && console.error(error.stack);

  return ctx.json({ success: false, message: error.message }, {});
};
