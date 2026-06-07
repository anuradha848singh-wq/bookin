FROM node:20-alpine AS base

# Install OS prerequisites (OpenSSL & compatibility shims)
RUN apk add --no-cache openssl libc6-compat

# Install pnpm globally (pinning to stable v9)
RUN npm install -g pnpm@9.15.4

WORKDIR /usr/src/app

# Copy root workspace configurations, lockfile, and npmrc hoisting settings
COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy all package.json files to cache dependency layers
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/lib/package.json ./packages/lib/
COPY packages/ui/package.json ./packages/ui/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/booking/package.json ./apps/booking/
COPY apps/marketing/package.json ./apps/marketing/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# Copy shared packages code
COPY packages/config ./packages/config
COPY packages/db ./packages/db
COPY packages/lib ./packages/lib
COPY packages/ui ./packages/ui

# Build the shared packages
RUN pnpm --filter @book-in/config... --filter @book-in/lib... --filter @book-in/db... run build || echo "Warning: shared package build had issues, continuing..."

# Copy marketing app code
COPY apps/marketing ./apps/marketing

# Use build arguments for public Next.js variables so they can be baked into the JS bundle
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_BASE_DOMAIN

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_BASE_DOMAIN=$NEXT_PUBLIC_BASE_DOMAIN

# Build the Next.js marketing app
RUN pnpm --filter @book-in/marketing run build

EXPOSE 3001

# Start the marketing application
CMD ["pnpm", "--filter", "@book-in/marketing", "start"]
