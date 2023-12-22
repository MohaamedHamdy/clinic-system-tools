FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port that your React app will run on during development
EXPOSE 3000

ENV REACT_APP_SERVER_URL=http://localhost:3001


# Start the development server
CMD ["npm", "start"]