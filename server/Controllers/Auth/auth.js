const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase } = require("../../config/supabaseClient");

const redisClient = require("../../redisClient");
require("dotenv").config();

// Supabase ulanish


// 📌 Ro‘yxatdan o‘tish (Register)
const register = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to‘ldiring!" });
    }

    email = email.trim().toLowerCase();
    if (password.length < 6) {
      return res.status(400).json({ message: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!" });
    }

    // Email mavjudligini tekshirish
    const { data: existingUser, error: fetchError } = await supabase.from("users").select("email").eq("email", email).single();
    if (fetchError && fetchError.code !== "PGRST116") return res.status(500).json({ message: "Tekshirishda xato" });
    if (existingUser) return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan." });

    // Parolni shifrlash
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";

    // Foydalanuvchini yaratish
    const { data: user, error } = await supabase.from("users").insert({ username, email, password: hashedPassword, role: userRole }).select("id, role").single();
    if (error) throw error;

    res.status(201).json({ message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!", userId: user.id, role: user.role });
  } catch (error) {
    console.error("Ro‘yxatdan o‘tishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// 📌 Kirish (Login)
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email va parol kiritilishi shart!" });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    // 1️⃣ Redis keshidan olish
    let user;
    const cachedUserData = await redisClient.get(`user-data:${email}`);
    if (cachedUserData) {
      user = JSON.parse(cachedUserData);
    } else {
      const { data, error } = await supabase.from("users").select("id, email, password, role").eq("email", email).single();
      if (error || !data) return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
      user = data;
      await redisClient.setEx(`user-data:${email}`, 3600, JSON.stringify(user));
    }

    // 2️⃣ Parolni tekshirish
    const isMatch = user.password && (await bcrypt.compare(password, user.password));
    if (!isMatch) return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });

    // 3️⃣ Token yaratish
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 4️⃣ Redis’da tokenni saqlash
    await redisClient.setEx(`user-token:${user.id}`, 3600, token);

    // 5️⃣ Cookie sozlash
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 3600000 });
    res.status(200).json({ message: "Tizimga muvaffaqiyatli kirdingiz!", token });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Server xatosi!" });
  }
};

// 📌 Profil olish
const getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase.from("users").select("id, email, role").eq("id", req.user.id).single();
    if (error || !user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    console.error("Profil olishda xatolik:", error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

module.exports = { register, login, getProfile };