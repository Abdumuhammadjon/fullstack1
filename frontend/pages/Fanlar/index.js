"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Home, Users, BarChart, Settings, Menu, PlusCircle, Edit, Trash } from "lucide-react";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [admin, setAdmin] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const router = useRouter();

  const handleUsersClick = () => {
    router.push("/Superadmin");
  };

  const handleSubjectClick = () => {
    router.push("/Fanlar");
  };

  const addSubject = () => {
    if (newSubject.trim() && admin.trim()) {
      if (editingSubject !== null) {
        setSubjects(subjects.map((subj, index) => index === editingSubject ? { name: newSubject, admin } : subj));
        setEditingSubject(null);
      } else {
        setSubjects([...subjects, { name: newSubject, admin }]);
      }
      setNewSubject("");
      setAdmin("");
    }
  };

  const editSubject = (index) => {
    setNewSubject(subjects[index].name);
    setAdmin(subjects[index].admin);
    setEditingSubject(index);
  };

  const deleteSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  return (
    <div className="flex -ml-5 flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md h-16 flex items-center px-6 fixed w-full z-10 top-0">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex flex-1 pt-16">
        <div className={`bg-gray-900 text-white fixed h-full p-5 top-16 transition-all duration-300 ${isOpen ? "w-64" : "w-20"} flex flex-col`}>
          <button className="text-white mb-6 focus:outline-none self-end" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>
          {isOpen && <h2 className="text-2xl font-bold mb-6">Dashboard</h2>}
          <ul className="space-y-4">
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg" onClick={handleUsersClick}>
              <Home size={24} /> {isOpen && "Bosh sahifa"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <Users size={24} /> {isOpen && "Foydalanuvchilar"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg" onClick={handleSubjectClick}>
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

        <div className="flex-1 p-8 pt-20" style={{ marginLeft: isOpen ? "16rem" : "5rem" }}>
          <div className="mt-10 p-6 max-w-2xl border rounded">
            <h2 className="text-2xl font-bold mb-4">Fan yaratish</h2>
            <input 
              type="text" 
              placeholder="Fan nomi" 
              value={newSubject} 
              onChange={(e) => setNewSubject(e.target.value)} 
              className="border p-2 w-full mb-2" 
            />
            <input 
              type="text" 
              placeholder="Admin nomi" 
              value={admin} 
              onChange={(e) => setAdmin(e.target.value)} 
              className="border p-2 w-full mb-2" 
            />
            <button 
              onClick={addSubject} 
              className="bg-blue-500 text-white px-4 py-2 rounded w-full">
              {editingSubject !== null ? "Tahrirlash" : "Qo'shish"}
            </button>
          </div>

          <div className="mt-6 p-6 max-w-2xl border rounded">
            <h2 className="text-2xl font-bold mb-4">Yaratilgan fanlar</h2>
            <ul className="space-y-2">
              {subjects.map((subject, index) => (
                <li key={index} className="border p-2 flex justify-between items-center">
                  <span>{subject.name} - Admin: {subject.admin}</span>
                  <div className="flex gap-2">
                    <button onClick={() => editSubject(index)} className="text-blue-500">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => deleteSubject(index)} className="text-red-500">
                      <Trash size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}