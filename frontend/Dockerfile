# Use an official Node runtime as a parent image
FROM node:14-slim

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /frontend
COPY . .

# Build the React app
RUN npm run build

# Expose the React app port
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]
