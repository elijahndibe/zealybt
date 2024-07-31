# Use the official lightweight Node.js image.
FROM node:16-alpine

# Install dependencies for Puppeteer.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD ["node", "app.js"]

# Add additional arguments to the Puppeteer launch command.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
