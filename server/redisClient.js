const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis xatosi:", err));

(async () => {
  await redisClient.connect();
  console.log("Redisga muvaffaqiyatli ulandi");
})();

module.exports = redisClient;
