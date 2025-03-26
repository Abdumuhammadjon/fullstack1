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
      const response = await axios.get("http://localhost:5001/api/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/admins");
      setAdmins(response.data.admins); 
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]); 
    }
  };

  const addSubject = async () => {
    if (newSubject.trim() && admin) {
      try {
        if (editingSubject !== null) {
          await axios.put(`http://localhost:5001/api/subjects/${editingSubject}`, { name: newSubject, adminId: admin });
        } else {
          await axios.post("http://localhost:5001/api/subjects", { name: newSubject, adminId: admin });
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

  const editSubject = (subject) => {
    setNewSubject(subject.name);
    setAdmin(subject.adminId);
    setEditingSubject(subject.id);
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/subjects/${id}`);
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
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <Home size={24} /> {isOpen && "Bosh sahifa"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <Users size={24} /> {isOpen && "Foydalanuvchilar"}
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
                <option key={adm.id} value={adm.id}>{adm.email}</option>
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
              {subjects.map((subject) => (
                <li key={subject.id} className="border p-2 flex justify-between items-center">
                  <span>{subject.name} - Admin ID: {subject.adminId}</span>
                  <div className="flex gap-2">
                    <button onClick={() => editSubject(subject)} className="text-blue-500">
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
