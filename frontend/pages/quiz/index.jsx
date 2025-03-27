import { useState, useEffect } from "react";
import axios from "axios";

export default function QuestionApp() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 📌 1️⃣ Backenddan fanlarni olish
  useEffect(() => {
    axios.get("http://localhost:5001/api/subjects")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Fanlarni olishda xatolik:", err));
  }, []);

  // 📌 2️⃣ Tanlangan fan bo‘yicha savollarni olish
  useEffect(() => {
    if (!selectedSubject) return;
    setLoading(true);

    axios.get(`http://localhost:5001/api/subject/${selectedSubject}`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
        setAnswers({});
      })
      .catch((err) => {
        console.error("Savollarni olishda xatolik:", err);
        setLoading(false);
      });
  }, [selectedSubject]);

  // 📌 3️⃣ Foydalanuvchi javoblarini yig‘ish
  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // 📌 4️⃣ Javoblarni backendga yuborish
  const handleSubmit = () => {
    axios.post("http://localhost:5001/submit", {
      subjectId: selectedSubject,
      answers,
    })
      .then((res) => {
        console.log("Yuborildi:", res.data);
        setSubmitted(true);
      })
      .catch((err) => console.error("Javoblarni yuborishda xatolik:", err));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-4 text-center">Fan bo‘yicha test</h1>

        {/* 📌 Fan tanlash select */}
        <select
          className="w-full p-3 border rounded-md mb-4"
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSubmitted(false);
          }}
        >
          <option value="">Fan tanlang</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>

        {/* 📌 Savollar yuklanishi */}
        {loading ? (
          <p className="text-gray-500 text-center">Savollar yuklanmoqda...</p>
        ) : selectedSubject ? (
          questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="p-4 border rounded-md">
                  <p className="font-medium">{q.question}</p>
                  {q.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        className="h-4 w-4"
                        onChange={() => handleAnswerChange(q.id, option)}
                      />
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
              ))}

              <button
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-4"
                onClick={handleSubmit}
              >
                Yuborish
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Bu fan bo‘yicha savollar yo‘q.</p>
          )
        ) : (
          <p className="text-gray-500 text-center">Iltimos, fanni tanlang.</p>
        )}

        {submitted && (
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-600 rounded-md">
            <p className="text-green-700">Javoblar muvaffaqiyatli yuborildi!</p>
          </div>
        )}
      </div>
    </div>
  );
}
