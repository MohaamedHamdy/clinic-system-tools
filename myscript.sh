docker run -d --name db --network=mynetwork \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 database

echo "Starting the pqsql Container, please wait..."
sleep 5

docker run -d --name backendcon --network mynetwork \
  -p 3001:3001 backend

docker run -d --name frontend --network mynetwork \
  -p 3000:3000 frontend

echo "Containers are now running."