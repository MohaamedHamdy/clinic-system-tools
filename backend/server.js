const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const { Pool } = require("pg")

var doctorId;

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



app.post('/api/addSlot' , async(req,res) => {
  const {date, start_time} = req.body;

  try{
    const client = await pool.connect();
    const queryAvailable = `SELECT * FROM slots WHERE date = $1 AND start_time = $2 AND doctor_id = $3`;
    const result = await client.query(queryAvailable, [date, start_time, 7])

    client.release();

    if(result.rows.length === 1)
    {
      res.status(500).json({ error: "error"})
    }
    else{
      const queryInsert = 'UPDATE slots SET date = $1, start_time = $2 WHERE doctor_id = $3';
      const result2 = await client.query(queryInsert, [date, start_time, 7]);

      res.json({ message: " success"});
    }
    client.release();

  } catch{

  }
})

app.post('/api/giveData', async (req, res) => {

  const {email, pass, userrole, username} = req.body;

  try {


    const client = await pool.connect();
    const userExists = "Select * FROM users WHERE email = $1";
    const result = await client.query(userExists, [email])

    if(result.rows.length === 1)
    {
      res.status(400).json({message: "Sorry, user already exists."})
    }
    else{

      const insertQuery = 'INSERT INTO users (email, pass, userrole, username) VALUES ($1, $2, $3, $4) RETURNING *';
      const newUser = await client.query(insertQuery, [email, pass, userrole, username])

      res.json({ message: "Sign up successful", user: newUser.rows[0]})

    }

    client.release();
   
  } catch (error){

    console.error("error during sign-up", error);
    res.status(500).json({ error: "Internal server error"});

  }

})


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
            const query = "SELECT userid FROM users WHERE userrole = 'Doctor'";
            const result2 = await client.query(query);
            doctorId=  result2.rows[0].userid;
            

            const query2 = 'INSERT INTO slots (doctor_id) VALUES ($1) RETURNING *';
            await pool.query(query2, [doctorId]);

            res.json({ message: 'Sign-in successful!' });

            //console.log(doctorId.rows);
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

