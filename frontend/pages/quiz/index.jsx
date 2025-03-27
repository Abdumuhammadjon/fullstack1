import { useState, useEffect } from "react";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    const fetchSubjects = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/subjects");
        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error("Fanlarni olishda xatolik", error);
      }
    };
    
    fetchSubjects();
  }, []);
  console.log(subjects);
  

  const fetchQuestions = async (subjectId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/subject/${subjectId}`);
      let data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
      setSelectedSubject(subjectId);
    } catch (error) {
      console.error("Savollarni olishda xatolik", error);
      setQuestions([]); // Xatolik yuz bersa, bo‘sh massiv qaytariladi
    }
    setLoading(false);
  };
  
  console.log(selectedSubject);
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Fanlar ro‘yxati</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={() => fetchQuestions(subject.id)}
          >
            {subject.id}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-700 mt-4">Yuklanmoqda...</p>}

      {selectedSubject && (
  <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Savollar</h2>
    {questions.length > 0 ? (
      <ul className="space-y-4">
        {questions.map((question) => (
          <li key={question.id} className="p-4 border-b">
            <p className="font-bold text-lg text-gray-900">{question.text}</p>
            <ul className="mt-2 space-y-2">
              {question.options.map((option, index) => (
                <li key={index} className="ml-4 p-2 bg-gray-200 rounded-lg">{option}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">Savollar mavjud emas.</p>
    )}
  </div>
)}

    </div>
  );
}