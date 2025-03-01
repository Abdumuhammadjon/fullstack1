const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Model/Auth/user");
const redisClient = require("../../redisClient");
require("dotenv").config();

// 📌 Ro‘yxatdan o‘tish (Register)
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Foydalanuvchi avval ro‘yxatdan o‘tmaganligini tekshirish
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan." });
    }

    // Parolni shifrlash (hash qilish)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Hashlangan parol:", hashedPassword);

    // Foydalanuvchini yaratish
    const user = await User.create({
      username,
      email,
      password: hashedPassword, // 🔥 SHIFRLANGAN PAROLNI SAQLAYMIZ
    });

    res.status(201).json({ message: "Foydalanuvchi ro‘yxatdan o‘tdi!", user });
  } catch (error) {
    console.error("Ro‘yxatdan o‘tishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// 📌 Tizimga kirish (Login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ 1. Redis'dan foydalanuvchini tekshirish
    const cachedUser = await redisClient.get(`user:${email}`);
    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ message: "Tizimga muvaffaqiyatli kirdingiz!", token });
    }

    // ✅ 2. Bazadan foydalanuvchini olish
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // ✅ 3. Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // ✅ 4. Token yaratish va Redis'ga foydalanuvchini qo‘shish
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await redisClient.setEx(`user:${email}`, 3600, JSON.stringify(user)); // Foydalanuvchini Redisga qo‘shish

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ message: "Tizimga muvaffaqiyatli kirdingiz!", token });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Server xatosi." });
  }
};


module.exports = { register, login };
