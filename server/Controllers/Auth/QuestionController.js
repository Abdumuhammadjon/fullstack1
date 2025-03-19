const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Savollarni saqlash funksiyasi
const saveQuestions = async (req, res) => {
  
  try {
    const questions = req.body;
    console.log(questions)                                                                                                                                            ;

    // Ma'lumotlarni tekshirish
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Savollar ro'yxati bo'sh yoki noto'g'ri!" });
    }

    for (const question of questions) {
      if (!question.questionText || !Array.isArray(question.options) || question.options.length !== 4) {
        return res.status(400).json({ message: "Savol yoki variantlar noto'g'ri formatda!" });
      }
      const hasCorrectOption = question.options.some(opt => opt.isCorrect);
      if (!hasCorrectOption) {
        return res.status(400).json({ message: "Har bir savolda kamida bitta to'g'ri variant bo'lishi kerak!" });
      }
    }

    // Supabase'ga savollarni saqlash
    const { data, error } = await supabase
      .from('questions') // Jadval nomini o‘zingizning jadvalingizga moslashtiring
      .insert(questions.map(q => ({
        questionText: q.questionText,
        options: q.options, // Supabase JSON formatini qo‘llab-quvvatlaydi
      })));

    if (error) {
      console.error("Supabase xatosi:", error);
      return res.status(500).json({ message: "Savollarni saqlashda xatolik yuz berdi!" });
    }

    return res.status(200).json({ message: "Savollar muvaffaqiyatli saqlandi!" });
  } catch (error) {
    console.error("Xatolik:", error);
    return res.status(500).json({ message: "Server xatosi!" });
  }
};

// Express routerga ulash uchun eksport
module.exports = { saveQuestions };