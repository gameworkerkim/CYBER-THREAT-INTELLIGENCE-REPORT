# syntax=docker/dockerfile:1

# ---------- build stage ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- runtime stage ----------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV ORT_SKILLS_DIR=/app/skills
WORKDIR /app

# non-root user
RUN addgroup -S ort && adduser -S ort -G ort

# production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY skills ./skills
COPY docs ./docs
COPY README* ./
COPY CHANGELOG.md ./
COPY package.json ./

# read-only rootfs support: everything writable lives in /tmp
ENV HOME=/tmp
USER ort

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('fs').accessSync('/app/dist/src/cli.js')"

ENTRYPOINT ["node", "dist/src/cli.js"]
CMD ["chat"]
