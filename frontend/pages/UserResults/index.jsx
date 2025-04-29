import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BarChart } from "lucide-react";
import axios from "axios";

const UserResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const subjectId = localStorage.getItem("subjectId");

    if (!token) {
      router.push("/Login");
      return;
    }

    const fetchResults = async () => {
      if (!userId) {
        setError("Foydalanuvchi ID topilmadi");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = subjectId
          ? `http://localhost:5001/api/userResults/${userId}?subjectId=${subjectId}`
          : `http://localhost:5001/api/userResults/${userId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setResults(response.data.results || []);
      } catch (err) {
        setError(err.response?.data?.error || "Natijalarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [router]);
  console.log(results);

  const handleBack = () => {
    router.push("/questions");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Head>
        <title>Foydalanuvchi Natijalari</title>
        <meta name="description" content="Foydalanuvchi test natijalari" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <BarChart size={24} />
            Foydalanuvchi Natijalari
          </h2>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
          >
            Orqaga
          </button>
        </div>

        {loading && <p className="text-gray-600">Natijalar yuklanmoqda...</p>}

        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>
        )}

        {!loading && !error && results.length === 0 && (
          <p className="text-gray-600">Hech qanday natija topilmadi.</p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To'g'ri javoblar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Umumiy savollar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sana
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.resultId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.correctAnswers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.totalQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.scorePercentage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserResults;
