const express = require("express");
const app = express();
const pool = require("./postgres/db.js");
const redis = require("./redis/redis.js"); // db.js ni import qildik
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const shortcuts = {
  google: "https://www.google.com",
  youtube: "https://www.youtube.com",
  chat: "https://chat.openai.com",
  sinftest7: "http://localhost:5000" // O'zingizning sayt URL manzilini qo‘ying
};


app.get("/:shortcut", (req, res) => {
  const url = shortcuts[req.params.shortcut];
  if (url) {
    res.redirect(301, url); // 301 - doimiy yo'naltirish
  } else {
    res.status(404).send("Bunday qisqa link mavjud emas.")
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // Bazaga test so‘rov
    res.send(`Baza ishladi: ${result.rows[0].now} ishladiii`);
    console.log('databaza ishladi')
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi");
  }
});


app.get("/cache", async (req, res) => {
    try {
      let data = await redis.get("myKey");
  
      if (!data) {
        console.log("🔄 Ma'lumot bazadan olinmoqda...");
        data = { message: "Salom, bu Redis cache dan!" };
  
        await redis.set("myKey", JSON.stringify(data), "EX", 60); // 60 sekundga cache qilish
      } else {
        console.log("✅ Cache-dan olingan ma'lumot!");
        data = JSON.parse(data);
      }
  
      res.json(data);
    } catch (error) {
      console.error("❌ Xatolik:", error);
      res.status(500).json({ error: "Server xatosi" });
    }
  }); 
app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishladi`);
});
