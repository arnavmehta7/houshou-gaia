# Use the official Node.js image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (this includes ts-node from package.json)
RUN npm install

# If you're using yarn:
# RUN yarn install

# Copy the rest of the application code
COPY . .

# Specify the command to run your TypeScript file with ts-node
CMD ["npm", "start"]

# Optionally, if you want to run directly with ts-node:
# CMD ["npx", "ts-node", "path_to_your_file.ts"]
