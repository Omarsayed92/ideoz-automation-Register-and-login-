# Use official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:v1.39.0-focal

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy test files and configuration
COPY tests/ tests/
COPY playwright.config.js ./

# Create directories for test results
RUN mkdir -p test-results screenshots

# Set environment variables
ENV CI=true
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Install browsers (already included in the image)
RUN npx playwright install

# Run tests by default
CMD ["npm", "test"]