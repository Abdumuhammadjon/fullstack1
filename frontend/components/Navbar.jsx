import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Token mavjud bo'lsa true, aks holda false
  }, [router]); // Router o'zgarganda holatni qayta tekshirish

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
        {isLoggedIn && (
          <li
            className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer bg-indigo-700 hover:bg-indigo-800 transition-colors duration-200"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="hidden md:inline font-medium">Chiqish</span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;