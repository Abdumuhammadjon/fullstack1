const express = require("express");
const app = express();
const pool = require("./postgres/db.js"); // db.js ni import qildik
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // Bazaga test so‘rov
    res.send(`Baza ishladi: ${result.rows[0].now}`);
    console.log('databaza ishladi')
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi");
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishladi`);
});
