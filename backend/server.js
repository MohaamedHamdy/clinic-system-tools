const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const { Pool } = require("pg")



app.use(bodyParser.json());
app.use(cors());

var doctorId;

const PORT = process.env.PORT || 3001


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tools',
  password: '2314',
  port: 5432, // Default PostgreSQL port
});



app.post('/api/bookSlot', async (req, res) => {
  try {

    const { slotId } = req.body;
    const client = await pool.connect();
    const query = `INSERT INTO appointments (slot_id, status) VALUES ($1, $2) RETURNING*`;
    await client.query(query, [slotId, 'booked']);

    client.release();

    res.json({ message: "booked successfuly!" });


  } catch {

  }

})


app.post('/api/viewSlots', async (req, res) => {
  try {

    const { doctorSlotId } = req.body;
    const client = await pool.connect();
    const query = `SELECT * FROM slots WHERE doctor_id = $1 `;
    const result = await client.query(query, [doctorSlotId]);

    client.release();
    res.json(result.rows);

  } catch {

  }
})

app.get('/api/doctors', async (req, res) => {
  try {
    const client = await pool.connect();
    const query = `SELECT * FROM users WHERE userrole = 'Doctor' `;
    const result = await client.query(query);

    client.release();

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/addSlot', async (req, res) => {
  const { date, start_time } = req.body;

  try {
    console.log("add slot", doctorId);
    const client = await pool.connect();
    const queryAvailable = `SELECT * FROM slots WHERE date = $1 AND start_time = $2 AND doctor_id = $3`;

    const result = await client.query(queryAvailable, [date, start_time, doctorId])

    client.release();

    if (result.rows.length === 1) {
      res.status(500).json({ error: "Slot time already used." })
    }
    else {

      const queryInsertSlot = 'INSERT INTO slots (doctor_id, date, start_time) VALUES ($1, $2, $3) RETURNING *';
      const resultInsertSlot = await client.query(queryInsertSlot, [doctorId, date, start_time]);

      res.json({ message: 'New slot added :D' });

    }
    client.release();

  } catch {

  }
})

app.post('/api/giveData', async (req, res) => {

  const { email, pass, userrole, username } = req.body;

  try {


    const client = await pool.connect();
    const userExists = "Select * FROM users WHERE email = $1";
    const result = await client.query(userExists, [email])

    if (result.rows.length === 1) {
      res.status(400).json({ message: "Sorry, user already exists." })
    }
    else {

      const insertQuery = 'INSERT INTO users (email, pass, userrole, username) VALUES ($1, $2, $3, $4) RETURNING *';
      const newUser = await client.query(insertQuery, [email, pass, userrole, username])

      res.json({ message: "Sign up successful", user: newUser.rows[0] })

    }

    client.release();

  } catch (error) {

    console.error("error during sign-up", error);
    res.status(500).json({ error: "Internal server error" });

  }

})


// app.post('/api/receiveData', async (req, res) => {
//     const { email, pass } = req.body;
//     console.log('Received data from React:', { email, pass });
//     try {
//         const client = await pool.connect();
//         const query = 'SELECT * FROM users WHERE email = $1 AND pass = $2';
//         const result = await client.query(query, [email, pass]);

//         client.release();

//         if (result.rows.length === 1) {
//             // Successful sign-in
//             const query = "SELECT userid FROM users WHERE email = $1 AND userrole = 'Doctor'";
//             const result2 = await client.query(query, [email]);
//             if(result2.rows.length ===1)
//             {
//               doctorId = result2.rows[0].userid;
//               console.log(doctorId);
//               const query3 = `SELECT doctor_id FROM slots WHERE doctor_id = $1`;
//               const result3 = await pool.query(query3, [doctorId])

//               if(result3.rows.length === 1)
//               {

//               }
//               else{
//                 const query2 = 'INSERT INTO slots (doctor_id) VALUES ($1) RETURNING *';
//                 await pool.query(query2, [doctorId]);
//               }

//             }


//             res.json({ message: 'Sign-in successful!' });


//         } else {
//             // Invalid credentials
//             res.status(401).json({ error: 'Invalid credentials' });
//         }
//     } catch (error) {
//         console.error('Error during sign-in:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }


// });

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

      const queryUserrole = "SELECT userid, userrole FROM users WHERE email = $1";
      const resultUserrole = await client.query(queryUserrole, [email]);

      if (resultUserrole.rows.length === 1) {
        const { userid, userrole } = resultUserrole.rows[0];

        // Check user role and handle accordingly
        if (userrole === 'Doctor') {
          const queryDoctorId = "SELECT userid FROM users WHERE email = $1 AND userrole = 'Doctor'";
          const resultDoctorId = await client.query(queryDoctorId, [email]);

          if (resultDoctorId.rows.length === 1) {
            doctorId = resultDoctorId.rows[0].userid;
            console.log('Doctor ID:', doctorId);

            const queryCheckSlots = 'SELECT doctor_id FROM slots WHERE doctor_id = $1';
            const resultCheckSlots = await pool.query(queryCheckSlots, [doctorId]);

            if (resultCheckSlots.rows.length === 0) {
              // If doctor_id does not exist in slots, insert a new slot
              const queryInsertSlot = 'INSERT INTO slots (doctor_id) VALUES ($1) RETURNING *';
              await pool.query(queryInsertSlot, [doctorId]);
            }
          }
        }

        res.json({ message: 'Sign-in successful!', userid, userrole });
      } else {
        res.status(500).json({ error: 'Failed to retrieve user information' });
      }
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

