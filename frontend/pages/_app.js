import "@/styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      // Cookie'dan tokenni tekshirish
      const token = Cookies.get('token'); // Token nomini loyihangizga moslashtiring

      if (!token) {
        router.push('/Login'); // Token bo'lmasa login sahifasiga yo'naltirish
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/auth/profile", {
          withCredentials: true, // Cookie’ni yuborish
          headers: {
            Authorization: `Bearer ${token}`, // Agar backend tokenni header'dan kutar bo'lsa
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Xatolik:", error.response?.data || error.message);
        setUser(null);
        router.push('/login'); // Xatolik bo'lsa ham login sahifasiga yo'naltirish
      }
    };

    fetchUser();
  }, [router]);

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