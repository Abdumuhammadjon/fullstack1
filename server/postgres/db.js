const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Render.com uchun SSL kerak
    },
  },
  logging: false, // Konsolda SQL so‘rovlarini ko‘rsatmaslik uchun
});

// PostgreSQL bilan ulanishni tekshirish
sequelize
  .authenticate()
  .then(() => console.log("✅ PostgreSQL ulanishi muvaffaqiyatli!"))
  .catch((err) => console.error("❌ PostgreSQL ulanishida xatolik:", err));

module.exports = sequelize;