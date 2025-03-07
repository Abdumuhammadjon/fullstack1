import React from 'react'
import Link from "next/link"; 

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
    <h1 style={styles.logo}>MyApp</h1>
    <ul style={styles.navLinks}>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/about">About</Link></li>
      <li><Link href="/contact">Contact</Link></li>
      
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