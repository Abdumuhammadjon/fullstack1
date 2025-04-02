import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from "next/router";
import { Menu, Home, Users, BarChart, Settings, LogOut } from 'lucide-react';

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Token yoki boshqa autentifikatsiya belgisi
    if (!token) {
      router.push('/Login'); // Agar token yo'q bo'lsa, login sahifasiga yo'naltirish
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleSubjectClick = () => {
    router.push("/results");
  };

  const handleResultsClick = () => {
    router.push("/UserResults");
  };

  const handleLogout = () => {
    document.cookie.split(";").forEach(function(cookie) {
      const name = cookie.split("=")[0].trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    router.push('/Login');
  };

  return (
    <div className="flex -ml-5 flex-col h-screen bg-gray-100">
      <Head>
        <title>Admin Paneli</title>
        <meta name="description" content="Savollar va variantlar qo‘shish" />
      </Head>

      <div className="bg-white shadow-md h-16 flex items-center px-6 fixed w-full z-50 top-0">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex flex-1 pt-16">
        <div className={`bg-gray-900 text-white fixed h-full p-5 top-16 transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
          <button className="text-white mb-6" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <Home size={24} /> {isOpen && "Bosh sahifa"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer" onClick={handleSubjectClick}>
              <Users size={24} /> {isOpen && "Foydalanuvchilar"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer" onClick={handleResultsClick}>
              <BarChart size={24} /> {isOpen && "Hisobotlar"}
            </li>
            <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <Settings size={24} /> {isOpen && "Sozlamalar"}
            </li>
            <br /><br />
            {isLoggedIn && (
              <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer" onClick={handleLogout}>
                <LogOut size={24} /> {isOpen && "Chiqish"}
              </li>
            )}
          </ul>
        </div>

        {/* Asosiy kontent uchun placeholder */}
        <div className={`flex-1 p-6 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Xush kelibsiz!</h2>
            <p className="text-gray-600">Bu admin panelining bosh sahifasi. Yuqoridagi menyudan kerakli bo‘limni tanlang.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;