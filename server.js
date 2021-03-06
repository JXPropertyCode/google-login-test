const express = require("express");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");

// enables us to use dotenv variables
dotenv.config();

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = express();

app.use(express.json());

// you can use mongodb for database
const users = [];

function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}

app.get("/", (req, res) => {
  res.send("200 OK");
});

app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  // get the users information
  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });
  res.status(201);
  res.json({ name, email, picture });
});

app.listen(process.env.SERVER_PORT || 8000, () => {
  console.log(
    `Server is ready at http://localhost:${process.env.SERVER_PORT || 8000}`
  );
});
