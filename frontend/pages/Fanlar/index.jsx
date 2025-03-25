"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Home, Users, BarChart, Settings, Menu, PlusCircle, Edit, Trash } from "lucide-react";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [admin, setAdmin] = useState("");
  const [admins, setAdmins] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchSubjects();
    fetchAdmins();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5001/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/admins");
      console.log("Admins API Response:", response.data.admins);
      setAdmins(response.data.admins); // Faqat massiv kelganda o‘rnatish
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]); // Xatolik bo‘lsa, bo‘sh massiv qo‘yish
    }
  };
  
  

  const handleUsersClick = () => {
    router.push("/Superadmin");
  };

  const handleSubjectClick = () => {
    router.push("/adminlar");
  };

  const addSubject = async () => {
    if (newSubject.trim() && admin.trim()) {
      try {
        if (editingSubject !== null) {
          await axios.put(`http://localhost:5001/subjects/${subjects[editingSubject].id}`, { name: newSubject, admin });
        } else {
          await axios.post("http://localhost:5001/subjects", { name: newSubject, admin });
        }
        fetchSubjects();
        setNewSubject("");
        setAdmin("");
        setEditingSubject(null);
      } catch (error) {
        console.error("Error adding/updating subject:", error);
      }
    }
  };

  const editSubject = (index) => {
    setNewSubject(subjects[index].name);
    setAdmin(subjects[index].admin);
    setEditingSubject(index);
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
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
            <select value={admin} onChange={(e) => setAdmin(e.target.value)} className="border p-2 w-full mb-2">
              <option value="">Admin tanlang</option>
              {admins.map((adm) => (
                <option key={adm.id} value={adm.name}>{adm.username}</option>
              ))}
            </select>
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
                <li key={subject.id} className="border p-2 flex justify-between items-center">
                  <span>{subject.name} - Admin: {subject.admin}</span>
                  <div className="flex gap-2">
                    <button onClick={() => editSubject(index)} className="text-blue-500">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => deleteSubject(subject.id)} className="text-red-500">
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