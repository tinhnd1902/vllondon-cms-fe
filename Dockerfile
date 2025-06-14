FROM node:20.11.1

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using yarn
RUN npm i

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE 8082

# Start the application
CMD ["yarn", "start", "-p", "8082"]