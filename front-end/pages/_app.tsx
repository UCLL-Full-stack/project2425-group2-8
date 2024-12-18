import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      if (router.pathname !== "/auth" && router.pathname !== "/register") {
        router.push("/auth");
      }
    } else {
      setIsLoggedIn(true);
    }
  }, [router.pathname]);

  const showSidebar =
    isLoggedIn &&
    router.pathname !== "/auth" &&
    router.pathname !== "/register";

  return (
    <div className="app-container">
      <Head>
        <title>Plateful</title>
        <meta
          name="description"
          content="Plateful - Your personal meal planning and shopping list app"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Meal planning made easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showSidebar && <Sidebar />}
      <main className="main-content">
        {isLoggedIn ||
        router.pathname === "/auth" ||
        router.pathname === "/register" ? (
          <Component {...pageProps} />
        ) : null}
      </main>
    </div>
  );
};

export default App;
