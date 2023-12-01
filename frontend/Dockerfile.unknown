FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port that your React app will run on during development
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]