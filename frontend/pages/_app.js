import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Mening Saytim</title>
        <link rel="icon" href="https://cdn-icons-png.flaticon.com/128/4688/4688995.png" />
      </Head>

      <Component {...pageProps} />
    </>




  )
}
