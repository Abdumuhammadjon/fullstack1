const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis({
  host: process.env.REDIS_HOST, // Render.com Redis host manzili
  port: process.env.REDIS_PORT, // Render.com Redis porti
  password: process.env.REDIS_PASSWORD, // Agar Redis parol talab qilsa
  tls: {}, // Render.com da SSL kerak bo‘lishi mumkin
});

redis.on("connect", () => {
  console.log("✅ Redis-ga muvaffaqiyatli ulandi!");
});

redis.on("error", (err) => {
  console.error("❌ Redis xatosi:", err);
});

module.exports = redis;
