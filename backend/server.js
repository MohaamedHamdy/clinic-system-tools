const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3001


app.post('/api/receiveData', (req, res) => {
    const receivedData = req.body;
    console.log('Received data from React:', receivedData);
  });



app.listen(PORT, () => {
    console.log(`Hello from server :D on port ${PORT}`);
});

