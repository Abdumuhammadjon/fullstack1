import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupedQuestions = ({ subjectId }) => {
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const storedSubjectId = localStorage.getItem("subjectId");
      const idToUse = subjectId || storedSubjectId;

      try {
        const response = await axios.get(`http://localhost:5001/api/subject/${idToUse}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = response.data;

        // Savollarni created_at bo'yicha guruhlash
        const grouped = data.reduce((acc, question) => {
          const date = new Date(question.created_at).toISOString().split('T')[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(question);
          return acc;
        }, {});

        setGroupedQuestions(grouped);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Savollarni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    if (subjectId || localStorage.getItem("subjectId")) fetchQuestions();
  }, [subjectId]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 bg-red-100 rounded-lg">
        Xatolik: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {Object.keys(groupedQuestions).sort().map((date) => (
        <div key={date} className="mb-4 w-full">
          <button
            onClick={() => setSelectedDate(selectedDate === date ? null : date)}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            {formatDate(date)}
          </button>
          {selectedDate === date && (
            <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
              {groupedQuestions[date].map((question, index) => (
                <div key={index} className="mb-4 border-b pb-2 last:border-b-0">
                  <p className="text-gray-600 font-medium mb-2">Savol:</p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-bold text-gray-900">{question.question_text}</p>
                    <ul className="mt-2 space-y-2">
                      {question.options.map((option) => (
                        <li
                          key={option.id}
                          className={`p-2 rounded-lg ${
                            option.is_correct ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {option.option_text}
                          {option.is_correct && (
                            <span className="ml-2 text-green-600 font-medium">✓</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupedQuestions;