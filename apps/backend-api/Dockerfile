FROM node:20-alpine AS base

# This stage uses turbo to prune the workspace to only what is needed for backend-api
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune --scope=backend-api --docker

# Add lockfile and package.json's to install dependencies
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# Ensure workspace definition is present
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY tsconfig.json tsconfig.json
RUN npm install -g pnpm && pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN npm install -g pnpm && pnpm run build --filter=backend-api...

# Final runner stage
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /app .

CMD ["node", "apps/backend-api/dist/server.js"]
