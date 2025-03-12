import "@/styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios"; // axios import qo‘shildi

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5001/auth/profile", {
          withCredentials: true, // Cookie’ni yuborish uchun
        });
        setUser(response.data);
      } catch (error) {
        console.error("Xatolik:", error.response?.data || error.message);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

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
        <Component {...pageProps} user={user} /> {/* user props sifatida uzatildi */}
      </Layout>
    </>
  );
}