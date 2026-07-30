# syntax=docker/dockerfile:1

FROM node:22-bookworm AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY bin ./bin
RUN npm run build \
  && npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
  npm_config_update_notifier=false

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/bin ./bin
COPY LICENSE README.md ./

# Mount the target repo at /workspace (and optionally reports at /reports).
# Runs as root in the ephemeral container so host-mounted /reports is writable.
WORKDIR /workspace
VOLUME ["/workspace", "/reports"]

ENTRYPOINT ["node", "/app/bin/codex-open-security.mjs"]
CMD ["--help"]
