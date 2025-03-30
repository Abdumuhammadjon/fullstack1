import "@/styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";
import Axios from "axios";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const { user } = pageProps;
  const [token , setToken] = useState(null)
  return (
    <>
      <Head>
        <title>Mening Saytim</title>
        <link
          rel="icon"
          href="https://cdnicons-png.flaticon.com/128/4688/4688995.png"
        />
      </Head>
      <Layout>
        <Component {...pageProps} user={user} />
      </Layout>
    </>
  );
}

