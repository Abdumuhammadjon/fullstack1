"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import { Home, Users, BarChart, Settings, Menu } from "lucide-react";

const ChartComponent = dynamic(() => import("../../components/ChartComponent"), { ssr: false });

// Zustand store (holatni boshqarish)
const useSubjectStore = create((set) => ({
  subjects: [],
  addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, subject] })),
  updateSubject: (id, updatedSubject) =>
    set((state) => ({
      subjects: state.subjects.map((subj) => (subj.id === id ? updatedSubject : subj)),
    })),
  deleteSubject: (id) =>
    set((state) => ({
      subjects: state.subjects.filter((subj) => subj.id !== id),
    })),
}));

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { register, handleSubmit, reset, setValue } = useForm();
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjectStore();
  const [editingSubject, setEditingSubject] = useState(null);

  const handleUsersClick = () => {
    router.push("/adminlar");
  };

  const onSubmit = (data) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, { ...data, id: editingSubject.id });
      setEditingSubject(null);
    } else {
      addSubject({ ...data, id: Date.now().toString() });
    }
    reset();
  };

 
  return (
    <div className="flex flex-col h-screen bg-gray-100">
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
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg" onClick={handleUsersClick}>
              <Users size={24} /> {isOpen && "Foydalanuvchilar"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <BarChart size={24} /> {isOpen && "Hisobotlar"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <Settings size={24} /> {isOpen && "Sozlamalar"}
            </li>
          </ul>
        </div>

        <div className={`flex-1 transition-all p-8 pt-20`} style={{ marginLeft: isOpen ? "16rem" : "5rem" }}>
         

          

          <div className="mt-10 p-6 max-w-2xl border rounded">
            <h2 className="text-2xl font-bold mb-4">Fanlarni boshqarish</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input {...register("name", { required: true })} placeholder="Fan nomi" className="border p-2 w-full" />
              <input {...register("email", { required: true })} type="email" placeholder="Email" className="border p-2 w-full" />
              <input {...register("password", { required: true })} type="password" placeholder="Parol" className="border p-2 w-full" />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {editingSubject ? "Tahrirlash" : "Qo‘shish"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
