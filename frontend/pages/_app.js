import "@/styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";
import Axios from "axios";

export default function App({ Component, pageProps }) {
  const { user } = pageProps;
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

App.getInitialProps = async ({ Component, ctx }) => {
  const { asPath } = ctx;
  let user = null;
  try {
    const response = await Axios.get("http://localhost:5001/auth/profile", {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    });
    user = response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      if (asPath !== "/Login") {
        // Redirect to login page
        if (ctx.res) {
          ctx.res.writeHead(302, { Location: "/Login" });
          ctx.res.end();
        }
        return {};
      } else {
        // It's login page, allow without token
        user = null;
      }
    } else {
      // Some other error
      throw error;
    }
  }
  return { pageProps: { user } };
};