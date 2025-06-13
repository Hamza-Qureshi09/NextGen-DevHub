# Build stage
FROM node:22-alpine AS builder

WORKDIR /myapps

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies (including devDependencies for build) & yarn is already available in npm
RUN yarn install

# Copy source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN yarn build

# Runtime stage
FROM node:22-alpine AS runtime

WORKDIR /myapps

# Install Alpine packages for Prisma (neccessary for migrations)
RUN apk add --no-cache openssl libc6-compat

# Copy production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy compiled files and Prisma Client
COPY --from=builder /myapps/dist ./dist
COPY --from=builder /myapps/src/generated ./dist/generated

# Copy Prisma schema and migrations (if needed)
COPY --from=builder /myapps/prisma ./prisma

# Expose port
EXPOSE 6002

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost:6002/health || exit 1