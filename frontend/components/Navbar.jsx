import React from 'react'
import Link from "next/link"; 
import { LogOut } from 'lucide-react';

const Navbar = () => {

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
    <nav style={styles.navbar}>
    <h1 style={styles.logo}>MyApp</h1>
    <ul style={styles.navLinks}>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/about">About</Link></li>
      <li><Link href="/contact">Contact</Link></li>
      <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer" onClick={handleLogout}>
  <LogOut size={24} /> { "Chiqish"}
</li>
      
    </ul>
  </nav>
  )
}
const styles = {
    navbar: { display: "flex", justifyContent: "space-between", padding: "15px", background: "#334", color: "#fff" },
    logo: { fontSize: "20px", fontWeight: "bold" },
    navLinks: { listStyle: "none", display: "flex", gap: "15px" }
  };
export default Navbar