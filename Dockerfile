# Use Node.js to build the Angular app
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install Angular CLI globally (matching your devDependencies)
RUN npm install -g @angular/cli@13.3.11

# Copy the rest of the Angular source code
COPY . .

# Expose port
EXPOSE 4200

# Run the dev server
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
