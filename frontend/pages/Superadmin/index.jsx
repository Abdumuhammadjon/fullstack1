import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Home, Users, BarChart, Settings, Menu } from "lucide-react";

// Grafik komponentini dinamik import qilish (SSR muammolarni oldini olish)
const ChartComponent = dynamic(() => import("../../components/ChartComponent"), { ssr: false });

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);

  // 📊 Grafik ma'lumotlari
  const data = {
    labels: ["Yanvar", "Fevral", "Mart", "Aprel", "May"],
    datasets: [
      {
        label: "Foydalanuvchilar soni",
        data: [50, 70, 90, 60, 120],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Oylik Foydalanuvchilar Statistikasi" },
    },
  };

  return (
    <div className="flex flex-col -ml-5 h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow-md h-16 flex items-center px-6 fixed w-full z-10 top-0">
        <h1 className="text-2xl font-bold text-gray-800">Navbar</h1>
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
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
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <BarChart size={24} /> {isOpen && "Hisobotlar"}
            </li>
            <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg">
              <Settings size={24} /> {isOpen && "Sozlamalar"}
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all p-8 pt-20`} style={{ marginLeft: isOpen ? "16rem" : "5rem" }}>
          <h1 className="text-4xl font-bold text-gray-800">Dashboard Paneli</h1>
          <p className="mt-4 text-gray-600">Bu yerda asosiy ma'lumotlar joylashadi.</p>

          {/* Grafiklar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <ChartComponent type="line" data={data} options={options} />
            <ChartComponent type="bar" data={data} options={options} />
            <ChartComponent type="pie" data={data} options={options} />
            <ChartComponent type="doughnut" data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
