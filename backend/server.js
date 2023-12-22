const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const { Pool } = require("pg")
const jwt = require('jsonwebtoken');


app.use(bodyParser.json());
app.use(cors());

// var doctorId;
// var patientId;


const jwtSecretKey = 'momooo';
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tools',
  password: process.env.DB_PASSWORD || '2314',
  port: process.env.DB_PORT || 5432,
});
console.log("hrloo from user " + process.env.DB_USER);
console.log("hrloo from host " + process.env.DB_HOST);
console.log("hrloo from user " + process.env.DB_NAME);
console.log("hrloo from user " + process.env.DB_PASSWORD);
console.log("hrloo from user " + process.env.DB_PORT);

function generateToken(userId, userrole) {
  const payload = { userId, userrole };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, jwtSecretKey, options);
}

function verifyToken(token) {
  try {
    // Remove "Bearer " prefix if present
    const cleanedToken = token.replace('Bearer ', '');

    const decoded = jwt.verify(cleanedToken, jwtSecretKey);
    return decoded;
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    console.error('JWT Token:', token);
    return null;
  }
}





// const PORT = process.env.PORT || 3001


// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'tools',
//   password: '2314',
//   port: 5432, // Default PostgreSQL port
// });

async function connectToDatabase() {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    // Retry after a delay
    setTimeout(connectToDatabase, 2000);
  }
}

connectToDatabase();


app.get('/api/showAppointments', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, userrole } = decodedToken;

    if (userrole === 'Patient') {
      const showQuery = `SELECT * FROM appointments WHERE patient_id = $1`;
      const result = await pool.query(showQuery, [userId]);
      res.json(result.rows);
    } else {
      return res.status(403).json({ error: 'Access forbidden' });
    }
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.get('/api/showAppointments', async (req, res) => {
//   try {

//     const showQuery = `SELECT * FROM appointments WHERE patient_id = $1`
//     const result = await pool.query(showQuery, [patientId]);
//     res.json(result.rows);

//   } catch (error) {

//     console.error('Error deleting appointment.', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// })




app.delete('/api/cancelAppointment', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, userrole } = decodedToken;

    if (userrole === 'Patient') {
      const { appointmentId, slotId } = req.body;
      const cancelAppointmentQuery = 'DELETE FROM appointments WHERE appointment_id = $1';
      await pool.query(cancelAppointmentQuery, [appointmentId]);

      const updateSlotsQ = `UPDATE slots SET availability = TRUE WHERE slot_id = $1 RETURNING*`;
      await pool.query(updateSlotsQ, [slotId]);

      res.status(200).json({ message: 'Appointment canceled successfully' });
    } else {
      return res.status(403).json({ error: 'Access forbidden' });
    }
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.delete('/api/cancelAppointment', async (req, res) => {

//   try {
//     const { appointmentId, slotId } = req.body;
//     const cancelAppointmentQuery = 'DELETE FROM appointments WHERE appointment_id = $1';
//     await pool.query(cancelAppointmentQuery, [appointmentId]);

//     const updateSlotsQ = `UPDATE slots SET availability = TRUE WHERE slot_id = $1 RETURNING*`;
//     await pool.query(updateSlotsQ, [slotId])


//     res.status(200).json({ message: 'Appointment canceled successfully' });
//   } catch (error) {
//     console.error('Error canceling appointment:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.post('/api/bookSlot', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, userrole } = decodedToken;

    if (userrole === 'Patient') {
      const { slotId } = req.body;
      const client = await pool.connect();
      const query = `INSERT INTO appointments (slot_id, patient_id, status) VALUES ($1, $2, $3) RETURNING*`;
      const query2 = `UPDATE slots SET availability = FALSE WHERE slot_id = $1 RETURNING*`;

      await pool.query(query2, [slotId]);
      await client.query(query, [slotId, userId, 'booked']);

      client.release();

      res.json({ message: 'Booked successfully!' });
    } else {
      return res.status(403).json({ error: 'Access forbidden' });
    }
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.post('/api/bookSlot', async (req, res) => {
//   try {

//     const { slotId } = req.body;
//     const client = await pool.connect();
//     const query = `INSERT INTO appointments (slot_id, patient_id, status) VALUES ($1, $2, $3) RETURNING*`;
//     const query2 = `UPDATE slots SET availability = FALSE WHERE slot_id = $1 RETURNING*`;

//     await pool.query(query2, [slotId]);
//     await client.query(query, [slotId, patientId, 'booked']);


//     client.release();

//     res.json({ message: "booked successfuly!" });


//   } catch {

//   }

// })
app.post('/api/doctor/slots', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, userrole } = decodedToken;

    if (userrole === 'Doctor' && userId === req.body.doctorSlotId) {
      const client = await pool.connect();
      const query = 'SELECT * FROM slots WHERE doctor_id = $1';
      const result = await client.query(query, [req.body.doctorSlotId]);

      client.release();
      return res.json(result.rows);
    } else {
      // Access forbidden or invalid doctor ID
      return res.status(403).json({ error: 'Access forbidden or invalid doctor ID' });
    }
  } catch (error) {
    console.error('Error retrieving doctor slots:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.post('/api/patient/slots', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Assuming the chosen doctor ID is provided in the request body
    const { doctorSlotId } = req.body;

    const client = await pool.connect();
    const query = 'SELECT * FROM slots WHERE doctor_id = $1';
    console.log(doctorSlotId);
    const result = await client.query(query, [doctorSlotId]);

    client.release();
    return res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving patient slots:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


// app.post('/api/viewSlots', async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     const decodedToken = verifyToken(token);

//     if (!decodedToken) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { userId, userrole } = decodedToken;

//     if (userrole === 'Doctor' && userId === req.body.doctorSlotId) {
//       const client = await pool.connect();
//       const query = 'SELECT * FROM slots WHERE doctor_id = $1';
//       const result = await client.query(query, [req.body.doctorSlotId]);

//       client.release();
//       return res.json(result.rows);
//     } else {
//       // Access forbidden or invalid doctor ID
//       return res.status(403).json({ error: 'Access forbidden or invalid doctor ID' });
//     }
//   } catch (error) {
//     console.error('Error retrieving slots:', error);
//     return res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });

// // app.post('/api/viewSlots', async (req, res) => {
// //   try {

// //     const { doctorSlotId } = req.body;
// //     const client = await pool.connect();
// //     const query = `SELECT * FROM slots WHERE doctor_id = $1 `;
// //     const result = await client.query(query, [doctorSlotId]);

// //     client.release();
// //     res.json(result.rows);

// //   } catch {

// //   }
// // })

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

app.get('/api/patients', async (req, res) => {
  try {
    const client = await pool.connect();
    const query = `SELECT * FROM users WHERE userrole = 'Patient' `;
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
  // console.log("hello from here");
  try {
    const token = req.headers.authorization;
    // console.log("TOKEN IN ADD SLOTS   " + token)
    const decodedToken = verifyToken(token);
    // console.log("TOKEN " + decodedToken);
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, userrole } = decodedToken;

    if (userrole === 'Doctor') {
      const client = await pool.connect();
      const queryAvailable = `SELECT * FROM slots WHERE date = $1 AND start_time = $2 AND doctor_id = $3`;

      const result = await client.query(queryAvailable, [date, start_time, userId]);

      if (result.rows.length === 1) {
        // Slot time already used
        client.release();
        return res.status(500).json({ error: "Slot time already used." });
      } else {
        // Insert a new slot
        const queryInsertSlot = 'INSERT INTO slots (doctor_id, date, start_time) VALUES ($1, $2, $3) RETURNING *';
        const resultInsertSlot = await client.query(queryInsertSlot, [userId, date, start_time]);

        client.release();
        return res.json({ message: 'New slot added :D', slot: resultInsertSlot.rows[0] });
      }
    } else {
      // Access forbidden
      return res.status(403).json({ error: 'Access forbidden' });
    }
  } catch (error) {
    console.error('Error adding slot:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



// app.post('/api/addSlot', async (req, res) => {
//   const { date, start_time } = req.body;

//   try {
//     console.log("add slot", doctorId);
//     const client = await pool.connect();
//     const queryAvailable = `SELECT * FROM slots WHERE date = $1 AND start_time = $2 AND doctor_id = $3`;

//     const result = await client.query(queryAvailable, [date, start_time, doctorId])

//     client.release();

//     if (result.rows.length === 1) {
//       res.status(500).json({ error: "Slot time already used." })
//     }
//     else {

//       const queryInsertSlot = 'INSERT INTO slots (doctor_id, date, start_time) VALUES ($1, $2, $3) RETURNING *';
//       const resultInsertSlot = await client.query(queryInsertSlot, [doctorId, date, start_time]);

//       res.json({ message: 'New slot added :D' });

//     }
//     client.release();

//   } catch {

//   }
// })



app.post('/api/signUp', async (req, res) => {

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
app.post('/api/signIn', async (req, res) => {
  const { email, pass } = req.body;

  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM users WHERE email = $1 AND pass = $2';
    const result = await client.query(query, [email, pass]);

    client.release();

    if (result.rows.length === 1) {
      const queryUserrole = "SELECT userid, userrole FROM users WHERE email = $1";
      const resultUserrole = await client.query(queryUserrole, [email]);

      if (resultUserrole.rows.length === 1) {
        const { userid, userrole } = resultUserrole.rows[0];

        const token = generateToken(userid, userrole);
        // console.log("TOken in sign in" + token);
        res.json({ message: 'Sign-in successful!', userid, userrole, token });
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

// app.post('/api/receiveData', async (req, res) => {
//   const { email, pass } = req.body;
//   console.log('Received data from React:', { email, pass });
//   try {
//     const client = await pool.connect();
//     const query = 'SELECT * FROM users WHERE email = $1 AND pass = $2';
//     const result = await client.query(query, [email, pass]);

//     client.release();

//     if (result.rows.length === 1) {
//       // Successful sign-in

//       const queryUserrole = "SELECT userid, userrole FROM users WHERE email = $1";
//       const resultUserrole = await client.query(queryUserrole, [email]);

//       if (resultUserrole.rows.length === 1) {
//         const { userid, userrole } = resultUserrole.rows[0];

//         // Check user role and handle accordingly
//         if (userrole === 'Doctor') {
//           const queryDoctorId = "SELECT userid FROM users WHERE email = $1 AND userrole = 'Doctor'";
//           const resultDoctorId = await client.query(queryDoctorId, [email]);

//           if (resultDoctorId.rows.length === 1) {
//             doctorId = resultDoctorId.rows[0].userid;
//             console.log('Doctor ID:', doctorId);

//             const queryCheckSlots = 'SELECT doctor_id FROM slots WHERE doctor_id = $1';
//             const resultCheckSlots = await pool.query(queryCheckSlots, [doctorId]);

//             if (resultCheckSlots.rows.length === 0) {
//               // If doctor_id does not exist in slots, insert a new slot
//               const queryInsertSlot = 'INSERT INTO slots (doctor_id) VALUES ($1) RETURNING *';
//               await pool.query(queryInsertSlot, [doctorId]);
//             }
//           }
//         } else if (userrole === 'Patient') {
//           const queryPatientId = "SELECT userid FROM users WHERE email = $1 AND userrole = 'Patient'";
//           const resultPatientId = await client.query(queryPatientId, [email]);

//           if (resultPatientId.rows.length === 1) {

//             patientId = resultPatientId.rows[0].userid;
//             console.log('Patient ID:', patientId);

//           }
//         }
//         res.json({ message: 'Sign-in successful!', userid, userrole });
//       } else {
//         res.status(500).json({ error: 'Failed to retrieve user information' });
//       }
//     } else {
//       // Invalid credentials
//       res.status(401).json({ error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error during sign-in:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




app.listen(PORT, () => {
  console.log(`Hello from server :D on port ${PORT}`);
});

