import { z } from 'zod';

import { INVALID_VERSION_MSG, MC_VERSIONS, stringSubst } from 'core';
import { PACKS_QUERY_MISSING_MSG } from '../constants/general';

const version = z.optional(
  z.enum(MC_VERSIONS, {
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_enum_value')
        return {
          message: stringSubst(INVALID_VERSION_MSG, {
            version: issue.received.toString(),
          }),
        };
      return { message: ctx.defaultError };
    },
  })
);
const packs = z.string({ required_error: PACKS_QUERY_MISSING_MSG });

export const getPacksSchema = z.object({ version });
export const downloadPacksZipSchema = z.object({ packs, version });
