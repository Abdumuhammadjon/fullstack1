import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode }from "jwt-decode"; // ✅ Tokenni decode qilish uchun

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ✅ Cookie ichidagi tokenni tekshirish va sahifaga yo‘naltirish
    const token = Cookies.get("token"); // 🍪 Tokenni olib kelish
    if (token) {
      try {
        const decoded = jwtDecode(token); // 🔑 Tokenni decode qilish
        console.log("🔍 Decoded Token:", decoded.role);

        if (decoded.role === "admin") {
          router.push("/Superadmin"); // 👨‍💼 Admin sahifasi
        } else {
          router.push("/"); // 👤 Oddiy foydalanuvchi sahifasi
        }
      } catch (error) {
        console.error("❌ Token decode qilishda xatolik:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:5001/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 🍪 Cookie’ni qabul qilish
        }
      );
      const token = res.data.token || Cookies.get("token")
      
      if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded.role);
        
        if (decoded.role === "admin") {
          router.push("/Superadmin");
        } else {
          router.push("/");
        }
      }

      console.log("✅ Login successful:", res.data, token);

      // ✅ Cookie avtomatik saqlanadi, endi tokenni tekshiramiz
    } catch (err) {
      console.error("❌ Login error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?
          <Link href="/register" className="text-blue-500 ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
