# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock if using yarn
COPY package.json .
# COPY yarn.lock .

# Install dependencies
RUN npm install
# or if using yarn:
# RUN yarn install

# Copy the built application files to the working directory
COPY dist/ .

# Expose the port your app runs on
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "run", "dev"]
# or if using yarn:
# CMD ["yarn", "start"]
