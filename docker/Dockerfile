# IMPORTANT: Multi-stage build for optimal size
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock turbo.json ./
COPY apps/*/package.json apps/*/yarn.lock ./apps/
COPY packages/*/package.json packages/*/yarn.lock ./packages/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN yarn build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000 3001

CMD ["node", "apps/api/dist/main.js"] 