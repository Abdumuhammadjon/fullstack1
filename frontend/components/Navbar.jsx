import React from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Cookiesni o'chirish
    document.cookie.split(";").forEach(function(cookie) {
      const name = cookie.split("=")[0].trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    // localStorage'ni tozalash
    localStorage.clear();
    
    // sessionStorage'ni tozalash
    sessionStorage.clear();

    // Login sahifasiga yo'naltirish
    router.push('/Login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <h1 className="text-2xl font-bold tracking-wide">
        <Link href="/">MyApp</Link>
      </h1>
      <ul className="flex items-center gap-8">
        <li>
          <Link href="/" className="text-white hover:text-indigo-200 transition-colors duration-200">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-white hover:text-indigo-200 transition-colors duration-200">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-white hover:text-indigo-200 transition-colors duration-200">
            Contact
          </Link>
        </li>
        <li 
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="hidden md:inline">Chiqish</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;