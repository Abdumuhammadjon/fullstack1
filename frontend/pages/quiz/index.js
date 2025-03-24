import { useState } from "react";

const subjects = {
  Matematika: [
    { id: 1, question: "2 + 2 nechaga teng?" },
    { id: 2, question: "5 × 3 nechaga teng?" },
  ],
  Biologiya: [
    { id: 1, question: "DNK nima?" },
    { id: 2, question: "O'simliklar qanday nafas oladi?" },
  ],
  Fizika: [
    { id: 1, question: "Nyutonning 2-qonuni nima?" },
    { id: 2, question: "Nima uchun osmon ko'k?" },
  ],
};

export default function QuestionApp() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    console.log("Yuborilgan javoblar:", answers);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-4 text-center">Fanlar bo‘yicha test</h1>
        
        <select
          className="w-full p-3 border rounded-md mb-4"
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setAnswers({});
            setSubmitted(false);
          }}
        >
          <option value="">Fan tanlang</option>
          {Object.keys(subjects).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        {selectedSubject ? (
          subjects[selectedSubject].length > 0 ? (
            <div className="space-y-4">
              {subjects[selectedSubject].map((q) => (
                <div key={q.id} className="p-4 border rounded-md">
                  <p className="font-medium">{q.question}</p>
                  <input
                    type="text"
                    placeholder="Javobingizni kiriting..."
                    className="w-full p-2 border rounded-md mt-2"
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
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
            <p className="text-green-700">Javoblar yuborildi!</p>
          </div>
        )}
      </div>
    </div>
  );
}
