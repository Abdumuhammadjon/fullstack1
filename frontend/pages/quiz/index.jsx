import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Har bir savol uchun tanlangan variantni saqlash uchun state
  const [selectedOptions, setSelectedOptions] = useState({});

  // Fanlarni olish
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/api/subjects");
        setSubjects(response.data);
      } catch (error) {
        console.error("Fanlarni olishda xatolik:", error);
        setError(error.response?.data?.error || "Fanlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Savollarni olish
  const fetchQuestions = async (subjectId) => {
    setLoading(true);
    setError(null);
    setSelectedOptions({}); // Yangi savollar yuklanganda tanlovlarni tozalash
    try {
      const response = await axios.get(`http://localhost:5001/api/subject/${subjectId}`);
      setQuestions(response.data);
      setSelectedSubject(subjectId);
    } catch (error) {
      console.error("Savollarni olishda xatolik:", error);
      setError(error.response?.data?.error || "Savollarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Radio tugmasi o'zgarganda ishlaydigan funksiya
  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId, // Tanlangan variantni savol ID si bo'yicha saqlash
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Fanlar ro‘yxati</h1>

      {error && <p className="text-red-500 mb-4">Xatolik: {error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <button
              key={subject.id}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
              onClick={() => fetchQuestions(subject.id)}
            >
              {subject.name}
            </button>
          ))
        ) : (
          <p className="text-gray-700">Fanlar yuklanmoqda...</p>
        )}
      </div>

      {loading && <p className="text-gray-700 mt-4">Yuklanmoqda...</p>}

      {selectedSubject && questions.length > 0 && !error && (
        <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Savollar</h2>
          <ul className="space-y-4">
            {questions.map((question) => (
              <li key={question.id} className="p-4 border-b">
                <p className="font-bold text-lg text-gray-900">{question.question_text}</p>
                {question.options?.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {question.options.map((option) => (
                      <li key={option.id} className="ml-4 flex items-center">
                        {/* Radio tugmasi qo'shildi */}
                        <input
                          type="radio"
                          name={`question-${question.id}`} // Har bir savol uchun alohida guruh
                          value={option.id}
                          checked={selectedOptions[question.id] === option.id} // Tanlangan variantni tekshirish
                          onChange={() => handleOptionChange(question.id, option.id)} // Tanlov o'zgarganda
                          className="mr-2"
                        />
                      <span
  className="p-3 rounded-lg bg-gray-100 border border-gray-300 w-full  text-gray-800 text-base font-medium hover:bg-gray-200 transition-all duration-200"
>
  {option.option_text}
</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 mt-2">Javob variantlari mavjud emas</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}