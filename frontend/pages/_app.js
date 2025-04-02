import "@/styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";
import Axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/Login", "/register"];
    
    if (!token) {
      if (!publicRoutes.includes(router.pathname)) {
        router.replace("/Login");
      }
      setLoading(false);
      return;
    }

    Axios.post("http://localhost:5001/auth/verify-token", { token }, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("❌ Token noto‘g‘ri yoki eskirgan:", err.response?.data);
        Cookies.remove("token");
        router.replace("/Login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.pathname]);

  if (loading || (!user && !["/Login", "/register, home, about, contact"].includes(router.pathname))) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Mening Saytim</title>
        <link rel="icon" href="https://cdnicons-png.flaticon.com/128/4688/4688995.png" />
      </Head>
      <Layout>
        <Component {...pageProps} user={user} />
      </Layout>
    </>
  );
}
