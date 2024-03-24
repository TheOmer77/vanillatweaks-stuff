ARG PORT=80

FROM node:20.11.1-alpine3.19 AS base
WORKDIR /app
RUN corepack enable pnpm

FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .eslintrc.json .prettierrc ./
COPY packages/core/package.json packages/core/package.json
COPY packages/api/package.json packages/api/package.json
RUN pnpm install --frozen-lockfile

COPY packages/core packages/core
COPY packages/api packages/api
RUN pnpm run lint:core && pnpm run build:api

FROM base AS runner
ARG PORT
ENV PORT=${PORT}
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder /app/package.json .
COPY --from=builder /app/packages/api/package.json packages/api/package.json
COPY --from=builder --chown=hono:hono /app/packages/api/dist packages/api/dist

EXPOSE ${PORT}
USER hono
CMD ["pnpm", "run", "start:api"]