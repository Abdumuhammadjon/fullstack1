import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ResultsPage = () => {
  const router = useRouter();
  const { subjectId } = router.query;

  const [results, setResults] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId || !subjectId) return;

      try {
        const res = await axios.get(
          `http://localhost:5001/api/userResults?userId=${userId}&subjectId=${subjectId}`
        );
        setResults(res.data.resultSummary || []);
        setSubjectName(res.data.subjectName || "Fan");
      } catch (err) {
        setError("Natijalarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [subjectId]);
  
  console.log(results);
  

  if (loading) return <p className="p-4">Yuklanmoqda...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (results.length === 0) return <p className="p-4">Natijalar topilmadi</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">{subjectName} bo‘yicha natijalar</h1>
      <ul className="space-y-4">
        {results.map((item, index) => (
          <li key={index} className="p-4 border rounded-md">
            <p className="font-medium text-gray-800 mb-1">
              {index + 1}. {item.questionText}
            </p>
            <p className="text-sm">
              Siz tanlagan:{" "}
              <span className="font-semibold text-blue-600">{item.selectedOptionText}</span>
            </p>
            {item.isCorrect !== undefined && (
              <p className="text-sm">
                To‘g‘ri javob:{" "}
                <span className="font-semibold text-green-600">{item.correctOptionText}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;

