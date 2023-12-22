# FROM node:latest

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# # Expose the port that your Node.js app will run on
# EXPOSE 3001

# # Script to wait for the database
# CMD ["npm", "run", "dev"]
FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3001 \
    DB_USER=postgres \
    DB_HOST=localhost \
    DB_NAME=tools \
    DB_PASSWORD=2314 \
    DB_PORT=5432

# Expose the port that your Node.js app will run on
EXPOSE $PORT

# Set environment variables


# Script to wait for the database
CMD ["npm", "run", "dev"]

# docker run --name backendcont --network=mynetwor -p 3001:3001 -e PORT=3001 -e DB_USER=postgres -e DB_HOST=db -e DB_NAME=tools -e DB_PASSWORD=2314 -e DB_PORT=5432 backend
# docker run --name db --network=mynetwor  -v postgres_data:/var/lib/postgresql/data -p 5432:5432 database
# docker run --name frontendcont --network=mynetwork -p 3000:3000 -e REACT_APP_SERVER_URL=http://localhost:3001 frontend