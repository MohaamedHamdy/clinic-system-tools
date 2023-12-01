docker build -t database ./db/

echo "Building the pqsql image, please wait..."
sleep 5

docker build -t frontend ./frontend/


echo "Building the frontend image, please wait..."
sleep 5


docker build -t backend ./backend/

echo "Building the backend image, please wait..."
sleep 5

echo "images created."