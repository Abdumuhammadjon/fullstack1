import { useState, useEffect } from "react";
import axios from "axios";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

const groupResultsByDate = (results) => {
  const grouped = {};
  results.forEach(result => {
    const date = new Date(result.date);
    const key = date.toISOString().slice(0, 10);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(result);
  });
  return grouped;
};

export default function UserResults() {
  const [results, setResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const subjectId = localStorage.getItem("subjectId")
      try {
        const response = await axios.get(`http://localhost:5001/api/subject/${subjectId}`);
        setResults(response.data);
        setGroupedResults(groupResultsByDate(response.data));
      } catch (error) {
        console.error("Natijalarni olishda xatolik:", error);
        setError(error.response?.data?.error || "Natijalarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Foydalanuvchilar Natijalari</h1>
      {error && <p className="text-red-500 mb-4">Xatolik: {error}</p>}
      {loading && <p className="text-gray-700 mt-4">Yuklanmoqda...</p>}
      
      {Object.keys(groupedResults).sort().map(date => (
        <div key={date} className="mb-4 w-full max-w-4xl">
          <button
            onClick={() => setSelectedDate(selectedDate === date ? null : date)}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            {formatDate(date)}
          </button>
          {selectedDate === date && (
            <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
              {groupedResults[date].map((result, index) => (
                <div key={index} className="mb-4 border-b pb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{result.user_name}</h2>
                  <p className="text-gray-600">Savollar:</p>
                  {result.questions.map((question) => (
                    <div key={question.id} className="mt-2 p-3 bg-gray-100 rounded-lg">
                      <p className="font-bold text-gray-900">{question.question_text}</p>
                      <ul className="mt-2 space-y-1">
                        {question.options.map((option) => (
                          <li key={option.id} className={`p-2 rounded-lg ${option.is_correct ? 'bg-green-200' : 'bg-gray-200'}`}>
                            {option.option_text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
