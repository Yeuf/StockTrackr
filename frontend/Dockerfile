# Use an official Node runtime as a parent image
FROM node:20.11.0-slim

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /frontend
COPY . .

# Set environment variable to determine build command
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Run build command based on environment
# RUN if [ "$NODE_ENV" = "production" ]; then npm run build; else npm run dev; fi

# Expose the React app port
EXPOSE 5173

# Run the React app
CMD ["npm", "run","dev", "--", "--host", "0.0.0.0"]
