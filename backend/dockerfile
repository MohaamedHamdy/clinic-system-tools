FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Set the user to a non-root user
USER node

# Start the application
CMD ["npm", "start"]


# docker run --name backendcont --network=mynetwor -p 3001:3001 -e PORT=3001 -e DB_USER=postgres -e DB_HOST=db -e DB_NAME=tools -e DB_PASSWORD=2314 -e DB_PORT=5432 backend
# docker run --name db --network=mynetwor  -v postgres_data:/var/lib/postgresql/data -p 5432:5432 database
# docker run --name frontendcont --network=mynetwork -p 3000:3000 -e REACT_APP_SERVER_URL=http://localhost:3001 frontend
