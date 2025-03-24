"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { create } from "zustand";

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
  const { register, handleSubmit, reset, setValue } = useForm();
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjectStore();
  const [editingSubject, setEditingSubject] = useState(null);

  const onSubmit = (data) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, { ...data, id: editingSubject.id });
      setEditingSubject(null);
    } else {
      addSubject({ ...data, id: Date.now().toString() });
    }
    reset();
  };

  const onEdit = (subject) => {
    setEditingSubject(subject);
    setValue("name", subject.name);
    setValue("email", subject.email);
    setValue("password", subject.password);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Fanlarni boshqarish</h1>

      {/* Fan yaratish va tahrirlash formasi */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded">
        <input {...register("name", { required: true })} placeholder="Fan nomi" className="border p-2 w-full" />
        <input {...register("email", { required: true })} type="email" placeholder="Email" className="border p-2 w-full" />
        <input {...register("password", { required: true })} type="password" placeholder="Parol" className="border p-2 w-full" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingSubject ? "Tahrirlash" : "Qo‘shish"}
          </button>
          {editingSubject && (
            <button onClick={() => { reset(); setEditingSubject(null); }} type="button" className="bg-gray-500 text-white px-4 py-2 rounded">
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      {/* Fanlar ro‘yxati */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-bold">Fanlar ro‘yxati</h2>
        {subjects.length === 0 && <p>Hozircha hech qanday fan yo‘q.</p>}
        {subjects.map((subject) => (
          <div key={subject.id} className="border p-4 flex justify-between items-center">
            <div>
              <p><strong>{subject.name}</strong></p>
              <p>Email: {subject.email}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => onEdit(subject)} className="bg-yellow-500 text-white px-4 py-2 rounded">Tahrirlash</button>
              <button onClick={() => deleteSubject(subject.id)} className="bg-red-500 text-white px-4 py-2 rounded">O‘chirish</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
