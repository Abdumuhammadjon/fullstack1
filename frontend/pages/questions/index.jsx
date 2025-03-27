import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios'; // Axios ni import qilamiz

export default function Admin() {
  const [questions, setQuestions] = useState([]);

  // Yangi savol qo‘shish
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

  // Savolni o‘chirish
  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  // Savol matnini o‘zgartirish
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  // Variant matnini o‘zgartirish
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(newQuestions);
  };

  // To‘g‘ri variantni belgilash
  const setCorrectOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === optionIndex,
    }));
    setQuestions(newQuestions);
  };

  // Ma’lumotlarni backendga jo‘natish (Axios bilan)
  const saveQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/question', questions, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert(response.data.message || 'Savollar muvaffaqiyatli saqlandi!'); // Backend xabarini ishlatamiz
        setQuestions([]); // Saqlangandan keyin savollar ro‘yxatini tozalash
      }
    } catch (error) {
      console.error('Xatolik:', error.response?.data || error.message);
      // Backend’dan kelgan xato xabarini ko‘rsatamiz
      const errorMessage = error.response?.data?.message || 'Server bilan bog‘lanishda xatolik!';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Head>
        <title>Admin Paneli</title>
        <meta name="description" content="Savollar va variantlar qo‘shish" />
      </Head>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Savollar Qo‘shish</h1>

      <div className={`bg-gray-900 text-white fixed h-full p-5 top-16 transition-all duration-300 ${isOpen ? "w-64" : "w-20"} flex flex-col`}>
          <button className="text-white mb-6 focus:outline-none self-end" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>
          {isOpen && <h2 className="text-2xl font-bold mb-6">Dashboard</h2>}
          <ul className="space-y-4">
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg" onClick={handleUsersClick}>
              <Home size={24} /> {isOpen && "Bosh sahifa"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg"  onClick={handleSubjectClick}>
              <Users size={24} /> {isOpen && "Foydalanuvchilar"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg" >
              <Users size={24} /> {isOpen && "Fan yaratish"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <BarChart size={24} /> {isOpen && "Hisobotlar"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <Settings size={24} /> {isOpen && "Sozlamalar"}
            </li>
          </ul>
        </div>

      {/* Savollar ro‘yxati */}
      <div className="w-full max-w-3xl space-y-8">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-white p-6 rounded-lg shadow-md relative">
            {/* Savol inputi */}
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              placeholder={`Savol ${qIndex + 1}`}
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Variantlar */}
            <div className="space-y-4">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    placeholder={`Variant ${oIndex + 1}`}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setCorrectOption(qIndex, oIndex)}
                    className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                      option.isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {option.isCorrect ? 'To‘g‘ri' : 'Belgilash'}
                  </button>
                </div>
              ))}
            </div>

            {/* Delete tugmasi */}
            <button
              onClick={() => deleteQuestion(qIndex)}
              className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              O‘chirish
            </button>
          </div>
        ))}
      </div>

      {/* Plus tugmasi (pastda) */}
      <button
        onClick={addQuestion}
        className="mt-8 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold hover:bg-blue-600 transition duration-300"
      >
        +
      </button>

      {/* Saqlash tugmasi */}
      {questions.length > 0 && (
        <button
          onClick={saveQuestions}
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-300"
        >
          Saqlash
        </button>
      )}
    </div>
  );
}