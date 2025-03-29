import "@/styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Yuklanish holati qo'shildi
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token'); // Tokenni tekshirish
      const currentPath = router.pathname; // Joriy sahifa URL'ini olish

      // Agar token bo'lmasa va joriy sahifa /Login dan boshqa bo'lsa
      if (!token && currentPath !== '/Login') {
        router.replace('/Login'); // /Login ga yo'naltirish
        return;
      }

      // Agar token bo'lsa, foydalanuvchi ma'lumotlarini olish
      if (token) {
        try {
          const response = await axios.get("http://localhost:5001/auth/profile", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Xatolik:", error.response?.data || error.message);
          setUser(null);
          router.replace('/Login'); // Xatolik bo'lsa login sahifasiga
        }
      }

      setIsLoading(false); // Yuklanish tugadi
    };

    checkAuth();
  }, [router.pathname]); // router.pathname qo'shildi

  // Yuklanish davom etayotgan bo'lsa, hech narsa render qilinmaydi
  if (isLoading) {
    return null; // Yoki loading spinner qo'shish mumkin
  }

  return (
    <>
      <Head>
        <title>Mening Saytim</title>
        <link
          rel="icon"
          href="https://cdn-icons-png.flaticon.com/128/4688/4688995.png"
        />
      </Head>
      <Layout>
        <Component {...pageProps} user={user} />
      </Layout>
    </>
  );
}