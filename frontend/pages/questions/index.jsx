import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Menu, Home, Users, BarChart, Settings } from 'lucide-react';

export default function Admin() {
  const [questions, setQuestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, qIndex) => qIndex !== index));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const setCorrectOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === oIndex,
    }));
    setQuestions(newQuestions);
  };

  const saveQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/question', questions, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert(response.data.message || 'Savollar muvaffaqiyatli saqlandi!');
      setQuestions([]);
    } catch (error) {
      alert(error.response?.data?.message || 'Server bilan bog‘lanishda xatolik!');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Head>
        <title>Admin Paneli</title>
        <meta name="description" content="Savollar va variantlar qo‘shish" />
      </Head>

      {/* HEADER */}
      <div className="bg-white shadow-md h-16 flex items-center px-6 fixed w-full z-50 top-0">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* SIDEBAR BACKDROP */}
      {isOpen && (
        <div
          className="bg-black bg-opacity-50 fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-1 pt-16">
        {/* SIDEBAR */}
        <div
          className={`bg-gray-900 text-white fixed h-full p-5 top-16 transition-all duration-300 z-50
            ${isOpen ? "md:w-64" : "w-20"}`}
        >
          <button className="text-white mb-6" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <Home size={24} /> {isOpen && "Bosh sahifa"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <Users size={24} /> {isOpen && "Foydalanuvchilar"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <BarChart size={24} /> {isOpen && "Hisobotlar"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <Settings size={24} /> {isOpen && "Sozlamalar"}
            </li>
          </ul>
        </div>

        {/* QUESTIONS */}
        <div className={`min-h-screen flex flex-col items-center py-8 flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Savollar Qo‘shish</h1>

          <div className="w-full max-w-3xl space-y-8">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white p-6 rounded-lg shadow-md relative">
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder={`Savol ${qIndex + 1}`}
                  className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="space-y-4">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Variant ${oIndex + 1}`}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setCorrectOption(qIndex, oIndex)}
                        className={`px-4 py-2 rounded-lg font-medium ${option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                      >
                        {option.isCorrect ? 'To‘g‘ri' : 'Belgilash'}
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => deleteQuestion(qIndex)} className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  O‘chirish
                </button>
              </div>
            ))}
          </div>

          <button onClick={addQuestion} className="mt-8 w-16 h-16 bg-blue-500 text-white rounded-full text-3xl font-bold hover:bg-blue-600">
            +
          </button>

          {questions.length > 0 && (
            <button onClick={saveQuestions} className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Saqlash
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
