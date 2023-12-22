docker run -d --name db --network=mynetwork \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 database

echo "Starting the pqsql Container, please wait..."
sleep 10


docker run -d --name backendcont --network=mynetwork \
    -p 3001:3001 -e PORT=3001 -e DB_USER=postgres \
    -e DB_HOST=db -e DB_NAME=tools -e DB_PASSWORD=2314 -e DB_PORT=5432 backend

# docker run -d --name backendcon --network mynetwork \
#   -p 3001:3001 backend
sleep 5

docker run -d --name frontendcont --network=mynetwork \
    -p 3000:3000 -e REACT_APP_SERVER_URL=http://localhost:3001 frontend

# docker run -d --name frontend --network mynetwork \
#   -p 3000:3000 frontend

echo "Containers are now running."