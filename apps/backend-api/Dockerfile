
# Base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files (removed pnpm-lock.yaml as it does not exist in this dir)
COPY package.json ./

# Install dependencies (using npm to auto-generate lockfile if needed)
RUN npm install

# Copy source code
COPY . .

# Build the project (compiles TS to JS)
RUN npm run build 

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/server.js"]
