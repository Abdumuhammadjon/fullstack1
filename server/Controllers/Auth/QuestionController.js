const Question = require('../../Model/Auth/Question');

const saveQuestions = async (req, res) => {
  try {
    const questions = req.body;

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

    // Savollarni bazaga saqlash
    await Question.bulkCreate(questions.map(q => ({
      questionText: q.questionText,
      options: q.options,
    })));

    return res.status(200).json({ message: "Savollar muvaffaqiyatli saqlandi!" });
  } catch (error) {
    console.error("Xatolik:", error);
    return res.status(500).json({ message: "Server xatosi!" });
  }
};

module.exports = { saveQuestions };