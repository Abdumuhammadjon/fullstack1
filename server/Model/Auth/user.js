const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../postgres/db"); // db.js faylingizni chaqiring

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

sequelize
  .sync({ alter: true }) // Jadval o‘chirilmaydi, faqat o‘zgarishlar kiritiladi
  .then(() => console.log("✅ Users jadvali yaratildi yoki yangilandi!"))
  .catch((err) => console.error("❌ Users jadvalini yaratishda xatolik:", err));

module.exports = User;
