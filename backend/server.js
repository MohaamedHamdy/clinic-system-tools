const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const { Pool } = require("pg")

app.use(bodyParser.json());
app.use(cors());


const PORT = process.env.PORT || 3001


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tools',
    password: '2314',
    port: 5432, // Default PostgreSQL port
});


app.post('/api/receiveData', async (req, res) => {
    const { email, pass } = req.body;
    console.log('Received data from React:', { email, pass });
    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM users WHERE email = $1 AND pass = $2';
        const result = await client.query(query, [email, pass]);

        client.release();

        if (result.rows.length === 1) {
            // Successful sign-in
            res.json({ message: 'Sign-in successful!' });
            console.log("success");
        } else {
            // Invalid credentials
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


});



app.listen(PORT, () => {
    console.log(`Hello from server :D on port ${PORT}`);
});

