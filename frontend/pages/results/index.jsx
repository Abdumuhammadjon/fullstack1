import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, Home, Users, BarChart, Settings } from 'lucide-react';

const GroupedQuestions = ({ subjectId }) => {
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const handleSubjectClick = () => {
    router.push("/questions");
  };

  const handleSubjectClick = () => {
    router.push("/results");
  };

  const handleSubjectClick = () => {
    router.push("/UserResults");
  };


  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const storedSubjectId = localStorage.getItem("subjectId");
      const idToUse = subjectId || storedSubjectId;

      try {
        const response = await axios.get(`http://localhost:5001/api/subject/${idToUse}`, {
          headers: { 'Content-Type': 'application/json' }
        });
        const data = response.data;

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

  return (
    <div className="flex flex-col -ml-5  h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow-md h-16 flex items-center px-6 fixed w-full z-50 top-0">
        <h1 className="text-2xl font-bold text-gray-800">Savollar Bazasi</h1>
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className={`bg-gray-900 text-white fixed h-full p-5 top-16 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
          <button className="text-white mb-6" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer" onClick={handleSubjectClick}>
              <Home size={24} /> {isSidebarOpen && "Bosh sahifa"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer" onClick={handleSubjectClick}>
              <Users size={24} /> {isSidebarOpen && "Foydalanuvchilar"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer" onClick={handleSubjectClick}>
              <BarChart size={24} /> {isSidebarOpen && "Hisobotlar"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <Settings size={24} /> {isSidebarOpen && "Sozlamalar"}
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={`flex-1 p-4 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-600 bg-red-100 rounded-lg">
              Xatolik: {error}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupedQuestions;