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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email va parol kiritilishi shart!" });
    }
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    console.log("Kelayotgan ma’lumotlar:", { email: trimmedEmail, password: trimmedPassword });

    let user;
    // 1. Redis keshidan foydalanuvchi ma’lumotlarini olish
    const cachedUserData = await redisClient.get(`user-data:${trimmedEmail}`);
    
    if (cachedUserData) {
      user = JSON.parse(cachedUserData);
      console.log("Keshdan olingan user:", user);
    } else {
      // Keshda yo‘q bo‘lsa, bazadan olish
      user = await User.findOne({ where: { email: trimmedEmail } });
      if (!user) {
        return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
      }
      console.log("Bazadagi user:", { id: user.id, email: user.email, password: user.password });
      
      // Bazadan olingan ma’lumotni keshga saqlash
      await redisClient.setEx(
        `user-data:${trimmedEmail}`,
        3600,
        JSON.stringify({
          id: user.id,
          email: user.email,
          password: user.password,
        })
      );
    }

    // 2. Parolni tekshirish
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log("Parol mosligi:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // 3. Token yaratish
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 4. Redis’da tokenni yangilash
    await redisClient.setEx(`user:${user.id}`, 3600, token);
    console.log("Redis’ga saqlangan token:", token);

    // 5. Cookie’ni sozlash
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.JWT_SECRET, // Xatolik: process.env.JWT_SECRET o‘rniga NODE_ENV
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Tizimga muvaffaqiyatli kirdingiz!" });
  } catch (error) {
    console.error("Xatolik:", error.message || error);
    res.status(500).json({ message: "Server xatosi!" });
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
