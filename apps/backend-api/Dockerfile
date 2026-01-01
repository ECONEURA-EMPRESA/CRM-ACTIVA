
FROM node:18-alpine AS base

# Prune
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune --scope=backend-api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
 
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install
 
# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
 
# Build the project
RUN pnpm turbo run build --filter=backend-api...
 
# Runner
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .
 
CMD ["node", "apps/backend-api/dist/server.js"]
