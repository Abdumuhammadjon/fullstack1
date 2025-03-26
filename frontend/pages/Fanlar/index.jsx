import { useEffect, useState } from "react";
import { getSubjects, createSubject, updateSubject, deleteSubject, getAdmins } from "../../services/api";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [admin, setAdmin] = useState("");
  const [admins, setAdmins] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchAdmins();
  }, []);

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
    if (!newSubject || !admin) return alert("Barcha maydonlarni to‘ldiring!");

    try {
      await createSubject({ name: newSubject, admin });
      setNewSubject("");
      fetchSubjects();
    } catch (error) {
      console.error("Fan qo‘shishda xatolik:", error);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject || !editingSubject.name || !editingSubject.admin)
      return alert("Barcha maydonlarni to‘ldiring!");

    try {
      await updateSubject(editingSubject.id, {
        name: editingSubject.name,
        admin: editingSubject.admin,
      });
      setEditingSubject(null);
      fetchSubjects();
    } catch (error) {
      console.error("Fan yangilashda xatolik:", error);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;

    try {
      await deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      console.error("Fan o‘chirishda xatolik:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Fanlar</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Fan nomi"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="border p-2 rounded"
        />
        <select value={admin} onChange={(e) => setAdmin(e.target.value)} className="border p-2 rounded">
          <option value="">Admin tanlang</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.username}
            </option>
          ))}
        </select>
        <button onClick={handleCreateSubject} className="bg-blue-500 text-white px-4 py-2 rounded">Qo‘shish</button>
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
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
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
                    onChange={(e) => setEditingSubject({ ...editingSubject, admin: e.target.value })}
                    className="border p-1"
                  >
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.username}
                      </option>
                    ))}
                  </select>
                ) : (
                  admins.find((a) => a.id === subject.admin)?.username || "Noma'lum"
                )}
              </td>
              <td className="border p-2">
                {editingSubject?.id === subject.id ? (
                  <button onClick={handleUpdateSubject} className="bg-green-500 text-white px-2 py-1 rounded">
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
