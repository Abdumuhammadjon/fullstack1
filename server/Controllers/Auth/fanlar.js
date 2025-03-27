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

  // 1. Avval admin allaqachon biror fanga biriktirilganligini tekshiramiz
  const { data: existingAdmin, error: adminCheckError } = await supabase
    .from("subjects")
    .select("*")
    .eq("admin", admin);

  if (adminCheckError) {
    return res.status(500).json({ error: "Admin tekshirishda xatolik yuz berdi!" });
  }

  if (existingAdmin.length > 0) {
    return res.status(400).json({ error: "Bu admin allaqachon boshqa fanga biriktirilgan!" });
  }

  // 2. Fan allaqachon mavjud emasligini tekshiramiz
  const { data: existingSubjects, error: fetchError } = await supabase
    .from("subjects")
    .select("*")
    .eq("name", name);

  if (fetchError) {
    return res.status(500).json({ error: "Fan ma'lumotlarini tekshirishda xatolik!" });
  }

  if (existingSubjects.length > 0) {
    return res.status(400).json({ error: "Bu fan allaqachon yaratilgan!" });
  }

  // 3. Agar hamma shartlar bajarilsa, yangi fan qo‘shamiz
  const { data, error } = await supabase.from("subjects").insert([{ name, admin }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Fan muvaffaqiyatli qo‘shildi!", subject: data });
};


// 📌 Fanlar ro‘yxatini olish
const getSubjects = async (req, res) => {
  try {
    const { data, error } = await supabase.from("subjects").select("*");

    if (error) {
      console.error("Fanlarni olishda xatolik:", error.message);
      return res.status(500).json({ error: "Fanlar ma'lumotlarini olishda xatolik yuz berdi!" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Server xatosi:", err);
    res.status(500).json({ error: "Serverda ichki xatolik yuz berdi!" });
  }
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

// 📌 Berilgan subjectId bo‘yicha savollarni olish
const getQuestionsBySubject = async (req, res) => {
  try {
    const  {id}  = req.params;
console.log(id);

    if (!id) {
      return res.status(400).json({ error: "subjectId talab qilinadi!" });
    }

    // Savollarni olish
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, text")
      .eq("subject_id", id)

    if (questionsError) {
      return res.status(500).json({ error: "Savollarni olishda xatolik!" });
    }

    // Har bir savolning variantlarini olish
    for (let question of questions) {
      const { data: options, error: optionsError } = await supabase
        .from("options")
        .select("id, text")
        .eq("question_id", question.id);

      if (optionsError) {
        return res.status(500).json({ error: "Variantlarni olishda xatolik!" });
      }

      question.options = options;
    }

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: "Serverda xatolik yuz berdi!" });
  }
};





module.exports = { createSubject, getSubjects, updateSubject, getQuestionsBySubject,  deleteSubject,  getAdmins };
