FROM node:14

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install
RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Make sure the images directory exists and has the correct permissions
RUN mkdir -p /app/src/images && chmod 755 /app/src/images

EXPOSE 3000

# Start the app
CMD ["npm", "start"] 