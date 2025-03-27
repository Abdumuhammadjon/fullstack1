const { supabase } = require("../../config/supabaseClient");

require('dotenv').config();





const getAdmins = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, role")
      .eq("role", "admin");

    if (error) throw error;

    res.status(200).json({ success: true, admins: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// 📌 Yangi fan qo‘shish
const createSubject = async (req, res) => {
  const { name, admin } = req.body;
  console.log(req.body);

  if (!name || !admin) {
    return res.status(400).json({ error: "Barcha maydonlarni to‘ldiring!" });
  }

  const { data, error } = await supabase.from("subjects").insert([{ name, admin }]);

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
  const { name, admin } = req.body;

  const { data, error } = await supabase
    .from("subjects")
    .update({ name, admin })
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




module.exports = { createSubject, getSubjects, updateSubject, deleteSubject,  getAdmins };
