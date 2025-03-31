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

const getQuestionsBySubject = async (req, res) => {
  try {
    // 1. Frontenddan kelgan subject ID ni olish
    const { id } = req.params;
    console.log("Kelgan subject ID:", id);

    // 2. Agar ID kelmagan bo'lsa, xato qaytarish
    if (!id) {
      return res.status(400).json({ error: "subjectId talab qilinadi!" });
    }

    // 3. Questions jadvalidan savollarni olish
    // subject_id ga mos keladigan savollar va ularning faqat id va question_text ni olamiz
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, question_text, created_at") // question_text jadvalda shunday nomlangan
      .eq("subject_id", id);

    // 4. Agar savollarni olishda xatolik bo'lsa, xato qaytarish
    if (questionsError) {
      console.error("Savollarni olishda xatolik:", questionsError);
      return res.status(500).json({ error: "Savollarni olishda xatolik!" });
    }

    // 5. Agar savollar bo'lmasa, bo'sh ro'yxat qaytarish
    if (!questions || questions.length === 0) {
      return res.status(200).json([]);
    }

    // 6. Har bir savol uchun options jadvalidan variantlarni olish
    for (let question of questions) {
      const { data: options, error: optionsError } = await supabase
        .from("options")
        .select("id, option_text") // option_text va is_correct ni olamiz
        .eq("question_id", question.id); // question.id orqali variantlarni filtrlaymiz

      // 7. Agar variantlarni olishda xatolik bo'lsa, xato qaytarish
      if (optionsError) {
        console.error("Variantlarni olishda xatolik:", optionsError);
        return res.status(500).json({ error: "Variantlarni olishda xatolik!" });
      }

      // 8. Savol obyektiga variantlarni qo'shish
      question.options = options || []; // Agar variantlar bo'lmasa bo'sh array
    }

    // 9. Natijani frontendga yuborish
    console.log(questions);
    return res.status(200).json(questions);
    
  } catch (err) {
    // 10. Umumiy xatolik bo'lsa, server xatosi qaytarish
    console.error("Server xatosi:", err);
    return res.status(500).json({ error: "Serverda xatolik yuz berdi!" });
  }
};

const checkUserAnswers = async (req, res) => {
  try {
    const { answers, userId, subjectId } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({ error: "Javoblar talab qilinadi!" });
    }

    if (!userId || !subjectId) {
      return res.status(400).json({ error: "Foydalanuvchi ID va subjectId talab qilinadi!" });
    }

    let correctCount = 0;
    const totalQuestions = answers.length;

    for (const answer of answers) {
      const { questionId, variantId } = answer;

      // Variantning to‘g‘ri yoki noto‘g‘ri ekanligini tekshirish
      const { data: option, error: optionError } = await supabase
        .from("options")
        .select("is_correct")
        .eq("id", variantId)
        .single();

      if (optionError) {
        console.error("Variantni tekshirishda xatolik:", optionError);
        return res.status(500).json({ error: "Variantni tekshirishda xatolik!" });
      }

      if (option && option.is_correct) {
        correctCount++;
      }
    }

    const scorePercentage = ((correctCount / totalQuestions) * 100).toFixed(2);

    // **Natijalarni saqlash**
    const { error: saveError } = await supabase
      .from("results")
      .insert([
        {
          user_id: userId,
          subject_id: subjectId,
          correct_answers: correctCount,
          total_questions: totalQuestions,
          score_percentage: scorePercentage,
          created_at: new Date().toISOString(),
        },
      ]);

    if (saveError) {
      console.error("Natijani saqlashda xatolik:", saveError);
      return res.status(500).json({ error: "Natijani saqlashda xatolik!" });
    }

    return res.status(200).json({
      totalQuestions,
      correctAnswers: correctCount,
      scorePercentage: `${scorePercentage}%`,
      message: "Natija muvaffaqiyatli saqlandi!",
    });

  } catch (err) {
    console.error("Server xatosi:", err);
    return res.status(500).json({ error: "Serverda xatolik yuz berdi!" });
  }
};






// Backendda (Express.js bilan)
// app.post("/api/submit-answers", async (req, res) => {
//   try {
//     // Frontenddan kelgan ma'lumotlarni olish
//     const { subject_id, answers } = req.body;

//     // Ma'lumotlarni tekshirish
//     if (!subject_id || !answers || !answers.length) {
//       return res.status(400).json({ error: "subject_id va answers talab qilinadi!" });
//     }

//     // Foydalanuvchi ID sini olish (agar autentifikatsiya bo'lsa)
//     // Agar autentifikatsiya yo'q bo'lsa, bu qismni o'chirib tashlash mumkin
//     const user_id = req.user?.id; // req.user autentifikatsiya middleware orqali keladi
//     if (!user_id) {
//       return res.status(401).json({ error: "Foydalanuvchi autentifikatsiyasi talab qilinadi!" });
//     }

//     // Ma'lumotlarni Supabase'dagi user_answers jadvaliga yozish
//     const insertPromises = answers.map(async (answer) => {
//       const { error } = await supabase.from("user_answers").insert({
//         subject_id: subject_id,
//         question_id: answer.question_id,
//         option_id: answer.option_id,
//         user_id: user_id, // Foydalanuvchi ID si
//         created_at: new Date().toISOString(), // Yaratilgan vaqt (agar jadvalda bo'lsa)
//       });

//       if (error) {
//         throw new Error(`Javobni saqlashda xatolik: ${error.message}`);
//       }
//     });

//     // Barcha insert operatsiyalarini bajarish
//     await Promise.all(insertPromises);

//     // Muvaffaqiyatli javob qaytarish
//     return res.status(200).json({ message: "Javoblar muvaffaqiyatli saqlandi!" });
//   } catch (err) {
//     console.error("Javoblarni saqlashda xatolik:", err);
//     return res.status(500).json({ error: "Javoblarni saqlashda xatolik yuz berdi!" });
//   }
// });



module.exports = { createSubject, getSubjects, updateSubject, getQuestionsBySubject, checkUserAnswers ,  deleteSubject,  getAdmins };
