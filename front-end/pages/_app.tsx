import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslation } from "next-i18next";

const App = ({ Component, pageProps }: AppProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

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

  const showBreadcrumb =
    isLoggedIn &&
    router.pathname !== "/auth" &&
    router.pathname !== "/register";

  const getPageName = () => {
    const routeNameMap: { [key: string]: string } = {
      "/": "Home",
      "/planner": "Planner",
      "/recipes": "Recipes",
      "/users": "Users",
    };

    if (router.pathname.startsWith("/recipes/[id]")) {
      return "Recipe";
    }

    return routeNameMap[router.pathname] || "Page";
  };

  const handleLanguageChange = () => {
    const newLocale = router.locale === "en" ? "zh" : "en";
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      {
        locale: newLocale,
      }
    );
  };

  return (
    <>
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

      <div
        className={`app-wrapper ${
          router.pathname === "/auth" ? "bg-gray-100" : ""
        }`}
      >
        {showSidebar && <AppSidebar />}
        <main className="main-content">
          {showBreadcrumb && (
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <Breadcrumb className="flex-1">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/planner">Plateful</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t(getPageName())}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Button
                variant="ghost"
                className="text-gray-700 hover:bg-gray-200"
                onClick={handleLanguageChange}
              >
                <Globe className="h-5 w-5" />
                <span>{router.locale === "en" ? "中文" : "EN"}</span>
              </Button>
            </header>
          )}
          <div className="p-4">
            {isLoggedIn ||
            router.pathname === "/auth" ||
            router.pathname === "/register" ? (
              <Component {...pageProps} />
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
};

export default appWithTranslation(App);
