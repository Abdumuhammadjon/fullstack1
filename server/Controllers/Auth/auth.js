const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const redisClient = require('../../redisClient');
require('dotenv').config();

// Supabase ulanish
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(req.body);

    // 1️⃣ Kiruvchi ma'lumotlarni tekshirish
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to‘ldiring!" });
    }

    // 2️⃣ Email mavjudligini tekshirish
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();
    if (fetchError && fetchError.code !== "PGRST116") {
      return res.status(500).json({ message: "Tekshirishda xato" });
    }
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan." });
    }

    // 3️⃣ Parol uzunligini tekshirish
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!" });
    }

    // 4️⃣ Parolni shifrlash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Role ni tekshirish (agar kelmasa 'user' deb qabul qilish)
    const userRole = role && role === "admin" ? "admin" : "user";

    // 6️⃣ Foydalanuvchini yaratish
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole, // ✅ Role kiritildi
      })
      .select("id, role") // Role qaytarilishini ham tekshiramiz
      .single();
    if (error) throw error;

    res.status(201).json({
      message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!",
      userId: user.id,
      role: user.role, // ✅ Role frontga qaytariladi
    });
  } catch (error) {
    console.error("Ro‘yxatdan o‘tishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};



// 📌 Kirish (Login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email va parol kiritilishi shart!" });
    }
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    let user;
    // 1️⃣ Redis keshidan olish
    const cachedUserData = await redisClient.get(`user-data:${trimmedEmail}`);
    if (cachedUserData) {
      user = JSON.parse(cachedUserData);
    } else {
      // Supabase’dan olish
      const { data, error } = await supabase
        .from('users')
        .select('id, email, password')
        .eq('email', trimmedEmail)
        .single();
      if (error || !data) {
        return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
      }
      user = data;

      // Keshga saqlash
      await redisClient.setEx(
        `user-data:${trimmedEmail}`,
        3600,
        JSON.stringify({ id: user.id, email: user.email, password: user.password })
      );
    }

    // 2️⃣ Parolni tekshirish
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // 3️⃣ Token yaratish
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 4️⃣ Redis’da tokenni saqlash
    await redisClient.setEx(`user:${user.id}`, 3600, token);

    // 5️⃣ Cookie sozlash
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.JWT_SECRET, // NODE_ENV ishlatiladi
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Tizimga muvaffaqiyatli kirdingiz!" });
  } catch (error) {
    console.error("Xatolik:", error.message || error);
    res.status(500).json({ message: "Server xatosi!" });
  }
};

// 📌 Profil olish
const getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', req.user.id)
      .single();
    if (error || !user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
};

module.exports = { register, login, getProfile };