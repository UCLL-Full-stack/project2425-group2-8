import { useState, useTransition } from "react";
import { useRouter } from "next/router";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";

const AuthToggle = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleSuccess = () => {
    router.push("/planner"); // redirects to planner page after successful login/signup
  };

  const handleTabChange = (value: string) => {
    startTransition(() => {
      setIsLogin(value === "login");
    });
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Plateful</CardTitle>
        <CardDescription>
          {isLogin ? "Welcome back!" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="login"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
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
      <CardFooter className="flex justify-center">
        {isLogin && (
          <Button variant="link" className="p-0">
            Forgot password?
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthToggle;
