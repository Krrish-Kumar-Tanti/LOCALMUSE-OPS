# Production Dockerfile for LocalMuse Ops Backend
# Node.js 22 LTS satisfies @qloo/qloo-harness engine requirement (Node >= 22.19.0)
FROM node:22-bookworm-slim

# Install @qloo/qloo-harness globally so the 'qloo' executable is in $PATH
RUN npm install -g @qloo/qloo-harness

# Set container working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies needed for TypeScript compilation)
RUN npm ci

# Copy TypeScript configuration and source code
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript into ./dist
RUN npm run build

# Remove development dependencies to keep the image lean and secure
RUN npm prune --production

# Default environment configuration
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Expose default port (hosting providers like Cloud Run, Railway, or Render override $PORT at runtime)
EXPOSE 4000

# Start compiled Express server
CMD ["npm", "start"]
