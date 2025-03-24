const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 📌 Yangi fan yaratish
const createSubject = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Barcha maydonlarni to‘ldiring!" });
  }

  const { data, error } = await supabase.from("subjects").insert([{ name, email, password }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: "Fan muvaffaqiyatli qo‘shildi!", subject: data });
};

// 📌 Fanlar ro‘yxatini olish
const getSubjects = async (req, res) => {
  const { data, error } = await supabase.from("subjects").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// 📌 Fanni yangilash
const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const { data, error } = await supabase
    .from("subjects")
    .update({ name, email, password })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Fan muvaffaqiyatli yangilandi!", subject: data });
};

// 📌 Fanni o‘chirish
const deleteSubject = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("subjects").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Fan o‘chirildi!" });
};

module.exports = { createSubject, getSubjects, updateSubject, deleteSubject };
