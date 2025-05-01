import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  getSubjects,
  updateSubject,
  deleteSubject,
  getAdmins,
} from "../../services/api";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [admin, setAdmin] = useState("");
  const [admins, setAdmins] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Xatolik xabarini saqlash uchun
  const router = useRouter();

  useEffect(() => {
    fetchSubjects();
    fetchAdmins();
  }, []);

  const handleBack = () => {
    router.push("/Superadmin");
  };

  const API_URL = "http://localhost:5001/api"; // Backend server manzili

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Fanlarni olishda xatolik:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Adminlarni olishda xatolik:", error);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubject.trim() || !admin.trim()) {
      setErrorMessage("Barcha maydonlarni to‘ldiring!");
      return;
    }

    const subjectData = { name: newSubject.trim(), admin: admin.trim() };
    console.log("Yuborilayotgan ma'lumot:", subjectData);

    try {
      const response = await axios.post(`${API_URL}/subjects`, subjectData);
      console.log("Fan yaratildi:", response.data);

      setNewSubject("");
      setAdmin("");
      setErrorMessage("");
      fetchSubjects();
    } catch (error) {
      console.error(
        "Fan qo‘shishda xatolik:",
        error.response ? error.response.data : error.message
      );

      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else if (error.response?.status === 400) {
        setErrorMessage("Noto‘g‘ri so‘rov! Ma’lumotlarni tekshiring.");
      } else {
        setErrorMessage("Noma'lum xatolik yuz berdi!");
      }
    }
  };
  const handleUpdateSubject = async () => {
    if (!editingSubject || !editingSubject.name || !editingSubject.admin) {
      setErrorMessage("Barcha maydonlarni to‘ldiring!");
      return;
    }

    try {
      await updateSubject(editingSubject.id, {
        name: editingSubject.name,
        admin: editingSubject.admin,
      });
      setEditingSubject(null);
      setErrorMessage("");
      fetchSubjects();
    } catch (error) {
      console.error("Fan yangilashda xatolik:", error);
      setErrorMessage(
        error.response?.data?.error || "Fan yangilashda xatolik yuz berdi!"
      );
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;

    try {
      await deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      console.error("Fan o‘chirishda xatolik:", error);
      setErrorMessage("Fan o‘chirishda xatolik yuz berdi!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-xl font-bold">Fanlar</h2>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
        >
          Orqaga
        </button>
      </div>

      {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Fan nomi"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={admin}
          onChange={(e) => setAdmin(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Admin tanlang</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.username}
            </option>
          ))}
        </select>
        <button
          onClick={handleCreateSubject}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Qo‘shish
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Fan nomi</th>
            <th className="border p-2">Admin</th>
            <th className="border p-2">Harakatlar</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td className="border p-2">{subject.id}</td>
              <td className="border p-2">
                {editingSubject?.id === subject.id ? (
                  <input
                    type="text"
                    value={editingSubject.name}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        name: e.target.value,
                      })
                    }
                    className="border p-1"
                  />
                ) : (
                  subject.name
                )}
              </td>
              <td className="border p-2">
                {editingSubject?.id === subject.id ? (
                  <select
                    value={editingSubject.admin}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        admin: e.target.value,
                      })
                    }
                    className="border p-1"
                  >
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.username}
                      </option>
                    ))}
                  </select>
                ) : (
                  admins.find((a) => a.id === subject.admin)?.username ||
                  "Noma'lum"
                )}
              </td>
              <td className="border p-2">
                {editingSubject?.id === subject.id ? (
                  <button
                    onClick={handleUpdateSubject}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Saqlash
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingSubject(subject)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      O‘chirish
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Subjects;
