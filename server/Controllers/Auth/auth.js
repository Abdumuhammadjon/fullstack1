const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Model/Auth/user");
const redisClient = require("../../redisClient");
require("dotenv").config();

// 📌 Ro‘yxatdan o‘tish (Register)
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1️⃣ Kiruvchi ma'lumotlarni tekshirish
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to‘ldiring!" });
    }

    // 2️⃣ Foydalanuvchi email orqali mavjudligini tekshirish (lowercase email saqlash)
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan." });
    }

    // 3️⃣ Parol uzunligi va xavfsizligini tekshirish
    if (password.length < 6) {
      return res.status(400).json({ message: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!" });
    }

    // 4️⃣ Parolni shifrlash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Foydalanuvchini yaratish
    const user = await User.create({
      username,
      email: email.toLowerCase(), // 🔥 email har doim kichik harflarda saqlanadi
      password: hashedPassword, 
    });

    res.status(201).json({ message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!", userId: user.id });

  } catch (error) {
    console.error("Ro‘yxatdan o‘tishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// 📌 Tizimga kirish (Login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Bazadan foydalanuvchini olish
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // 2. Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // 3. Token yaratish
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 4. Redis’ga saqlash (optimallashtirish uchun)
    const cachedUser = await redisClient.get(`user:${email}`);
    if (!cachedUser) {
      await redisClient.setEx(`user:${email}`, 3600, JSON.stringify(user));
    }

    // 5. Cookie’ni sozlash
    res.cookie("token", token, {
      httpOnly: true, // XSS’dan himoya
      secure: process.env.NODE_ENV === "production", // Faqat HTTPS’da
      sameSite: "Strict", // CSRF’dan himoya
      maxAge: 60 * 60 * 1000, // 1 soat (millisekundda)
    });

    // 6. Javob qaytarish (tokenni qaytarish shart emas)
    res.json({ message: "Tizimga muvaffaqiyatli kirdingiz!" });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Server xatosi." });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
};

module.exports = { register, login, getProfile };
