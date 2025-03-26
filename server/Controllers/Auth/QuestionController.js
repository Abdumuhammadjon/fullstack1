const { supabase } = require("../../config/supabaseClient");




const saveQuestions = async (req, res) => {
  const questions = req.body;

  try {
    // Har bir savolning faqat bitta to'g'ri varianti borligini tekshirish
    for (const question of questions) {
      const correctOptions = question.options.filter(opt => opt.isCorrect).length;
      if (correctOptions !== 1) {
        return res.status(400).json({ message: 'Har bir savol uchun faqat bitta to\'g\'ri variant belgilanishi kerak!' });
      }
    }

    // Har bir savol va uning variantlarini bazaga kiritish
    for (const question of questions) {
      // Savolni kiritish
      const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .insert([{ question_text: question.questionText }])
      .select()
      .single();
      if (questionError) {
        throw new Error(questionError.message);
      }

      const questionId = questionData.id;

      // Variantlarni kiritish
      const optionsToInsert = question.options.map(opt => ({
        question_id: questionId,
        option_text: opt.text,
        is_correct: opt.isCorrect
      }));

      const { error: optionsError } = await supabase
        .from('options')
        .insert(optionsToInsert);

      if (optionsError) {
        throw new Error(optionsError.message);
      }
    }

    // Muvaffaqiyatli javob
    res.status(200).json({ message: 'Savollar muvaffaqiyatli saqlandi!' });
  } catch (error) {
    // Xato holati
    res.status(500).json({ message: error.message });
  }
};



// Express routerga ulash uchun eksport
module.exports = { saveQuestions };