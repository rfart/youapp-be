FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Install dependencies required for bcrypt compilation
RUN apk add --no-cache python3 make g++ && \
    ln -sf /usr/bin/python3 /usr/bin/python

# Set Python path explicitly
ENV PYTHON=/usr/bin/python3

COPY package*.json ./

# Use --force to ensure native modules are built for this architecture
RUN npm install --force

COPY . .

# Rebuild bcrypt specifically for this environment
RUN npm rebuild bcrypt --build-from-source && \
    npm run build

FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
# Set Python path explicitly
ENV PYTHON=/usr/bin/python3

WORKDIR /usr/src/app

COPY package*.json ./

# Install production dependencies and ensure bcrypt is built for this platform
RUN apk add --no-cache python3 make g++ && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    npm install --only=production --force && \
    npm rebuild bcrypt --build-from-source

# Copy built application
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
