ARG PORT=80

FROM oven/bun:1.0.6-slim as base
WORKDIR /app

FROM base as builder
COPY package.json bun.lockb tsconfig.json .eslintrc.json .prettierrc ./
COPY packages packages
RUN bun install --frozen-lockfile

COPY packages/core packages/core
COPY packages/api packages/api
RUN bun run lint:core && bun run build:api

FROM base as runner
ARG PORT
ENV PORT=${PORT}
ENV NODE_ENV=production

COPY --from=builder /app/package.json .
COPY --from=builder /app/packages/api/package.json packages/api/package.json
COPY --from=builder --chown=bun:bun /app/packages/api/dist packages/api/dist

EXPOSE ${PORT}
USER bun
CMD [ "bun", "run", "start:api" ]