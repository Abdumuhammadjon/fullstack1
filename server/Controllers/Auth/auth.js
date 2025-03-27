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
      const { data, error } = await supabase
        .from("users")
        .select("id, email, password, role")
        .eq("email", email)
        .single();

      if (error || !data) {
        return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
      }

      user = data;

      // 🔹 Faqat **admin** bo‘lsa `subjectId` ni olish
      if (user.role === "admin") {
        const { data: subjectData, error: subjectError } = await supabase
          .from("subjects")
          .select("id")
          .eq("admin", user.id) 
          .single();

        if (!subjectError && subjectData) {
          user.subjectId = subjectData.id;
        } else {
          user.subjectId = null; // Admin bo‘lsa ham subjectId bo‘lmasligi mumkin
        }
      } else {
        user.subjectId = null; // Oddiy foydalanuvchilarga subjectId kerak emas
      }

      // Redis keshga subjectId bilan saqlash
      await redisClient.setEx(`user-data:${email}`, 3600, JSON.stringify(user));
    }

    // 3️⃣ Parolni tekshirish
    const isMatch = user.password && (await bcrypt.compare(password, user.password));
    if (!isMatch) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });
    }

    // 4️⃣ Token yaratish (faqat admin bo‘lsa subjectId qo‘shiladi)
    const tokenPayload = { id: user.id, role: user.role };
    if (user.role === "admin" && user.subjectId) {
      tokenPayload.subjectId = user.subjectId;
    }
    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 5️⃣ Redis’da token va subjectId ni saqlash
    await redisClient.setEx(`user-token:${user.id}`, 3600, JSON.stringify({ token, subjectId: user.subjectId || null }));

    // 6️⃣ Cookie sozlash
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.status(200).json({ 
      message: "Tizimga muvaffaqiyatli kirdingiz!", 
      token,
      subjectId: user.subjectId || undefined, // Agar admin bo‘lmasa, subjectId qaytarilmaydi
      adminId: user.id 
    });

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