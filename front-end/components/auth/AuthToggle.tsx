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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
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

      <div className="w-full max-w-2xl mt-6">
        <table className="min-w-full bg-white mx-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Password</th>
              <th className="py-2 px-4 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">annie</td>
              <td className="py-2 px-4 border-b">@NNie123</td>
              <td className="py-2 px-4 border-b">admin</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">shulin</td>
              <td className="py-2 px-4 border-b">Shul!n123</td>
              <td className="py-2 px-4 border-b">user</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Amelie</td>
              <td className="py-2 px-4 border-b">h0tchOcol@te101</td>
              <td className="py-2 px-4 border-b">guest</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthToggle;
