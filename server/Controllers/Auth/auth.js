const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../Model/Auth/authModel");
require("dotenv").config();

// 📌 Ro‘yxatdan o‘tish (Register)
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Foydalanuvchi bazada borligini tekshirish
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan." });
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10);

    // Foydalanuvchini yaratish
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!", user: newUser });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Server xatosi." });
  }
};

// 📌 Tizimga kirish (Login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Foydalanuvchini bazadan topish
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // Parolni tekshirish
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // Token yaratish
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Tizimga muvaffaqiyatli kirdingiz!", token });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Server xatosi." });
  }
};

module.exports = { register, login };
