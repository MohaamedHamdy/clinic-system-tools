CREATE TABLE users (
  userid SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  userrole VARCHAR(10) NOT NULL
);

CREATE TABLE slots (
  slot_id SERIAL PRIMARY KEY,
  date DATE,
  start_time TIME WITHOUT TIME ZONE,
  end_time TIME WITHOUT TIME ZONE,
  availability BOOLEAN DEFAULT true,
  doctor_id INTEGER REFERENCES users(userid)
);

CREATE TABLE appointments (
  appointment_id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES users(userid),
  slot_id INT REFERENCES slots(slot_id),
  status VARCHAR(20)
);



