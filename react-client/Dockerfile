FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Vite dev server port
EXPOSE 5173

# Make Vite dev server accessible from outside
# Script "dev-exposed" is defined in package.json
CMD ["npm", "run", "dev-exposed"]