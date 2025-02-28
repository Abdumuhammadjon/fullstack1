const { DataTypes } = require("sequelize");
const sequelize = require("../../postgres/db");

 // `sequelize` obyektini to‘g‘ri import qilish

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  password: {
    type: DataTypes.STRING, // TEXT emas, STRING ishlatish xavfsizroq
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = User;



