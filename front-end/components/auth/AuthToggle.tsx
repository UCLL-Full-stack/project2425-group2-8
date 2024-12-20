import { useState, useTransition } from "react";
import { useRouter } from "next/router";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useTranslation } from "next-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthToggle = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { t } = useTranslation("common");
  const { locale, pathname, asPath, query } = router;

  const handleSuccess = () => {
    router.push("/planner");
  };

  const handleTabChange = (value: string) => {
    startTransition(() => {
      setIsLogin(value === "login");
    });
  };
  const handleLanguageChange = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="relative">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Plateful</CardTitle>
            <CardDescription>
              {isLogin ? t("welcomeBack") : t("createNewAccount")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleLanguageChange}
              className="w-6 h-6 rounded-full"
              aria-label="Change Language"
            >
              <Globe size={24} />
            </button>
            <span>{router.locale === "en" ? "中文" : "EN"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="login"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("login")}</TabsTrigger>
            <TabsTrigger value="register">{t("register")}</TabsTrigger>
          </TabsList>
          <div
            className={`mt-4 transition-opacity duration-300 ${
              isPending ? "opacity-50" : "opacity-100"
            }`}
          >
            <TabsContent value="login">
              <LoginForm onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="register">
              <SignupForm onSuccess={handleSuccess} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthToggle;
