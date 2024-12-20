import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginData, StatusMessage } from "@/types/auth";
import { AlertCircle } from "lucide-react";
import AuthService from "../../services/authService";
import { useTranslation } from "next-i18next";

type Props = {
  onSuccess: () => void;
};

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [inviterUsername, setInviterUsername] = useState("");
  const [isGuestLogin, setIsGuestLogin] = useState(false);

  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    const role = localStorage.getItem("role");
  }, []);

  const clearErrors = () => {
    setUsernameError(null);
    setPasswordError(null);
    setFormError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!username || username.trim() === "") {
      setUsernameError(t("usernameRequired"));
      result = false;
    } else {
      setUsernameError("");
    }

    if (!password || password.trim() === "") {
      setPasswordError(t("passwordRequired"));
      result = false;
    } else if (password.length < 6) {
      setPasswordError(t("passwordTooShort"));
      result = false;
    } else {
      setPasswordError("");
    }

    return result;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearErrors();

    if (!validate()) {
      return;
    }

    const loginData: LoginData = { username, password };

    try {
      const response = await AuthService.login(loginData);

      if (response.ok) {
        const userData = await response.json();

        setStatusMessages([
          {
            message: t("loginSuccessful"),
            type: "success",
          },
        ]);

        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", userData.role);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            token: userData.token,
            fullname: userData.fullname,
            username: userData.username,
            role: userData.role,
          })
        );

        setTimeout(() => {
          router.push("/planner");
        }, 2000);
      } else {
        setFormError(t("invalidCredentials"));
      }
    } catch (error) {
      setFormError(t("invalidCredentials"));
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await AuthService.loginAsGuest(inviterUsername);
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", "guest");
        localStorage.setItem("guestOf", inviterUsername);
        router.push("/planner");
      } else {
        console.error("Guest login failed");
      }
    } catch (error) {
      console.error("Error logging in as guest:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isGuestLogin ? (
        <>
          <Label htmlFor="inviterUsername">{t("inviterUsername")}</Label>
          <Input
            id="inviterUsername"
            value={inviterUsername}
            onChange={(e) => setInviterUsername(e.target.value)}
            required
          />
          <div className="flex gap-3">
            <Button onClick={handleGuestLogin} className="bg-gray-900">
              {t("loginAsGuest")}
            </Button>
            <Button
              onClick={() => setIsGuestLogin(false)}
              className="bg-teal-700 hover:bg-teal-600"
            >
              {t("backToLogin")}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            {usernameError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{usernameError}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
          </div>
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-3">
            <Button type="submit">{t("login")}</Button>
            <Button
              onClick={() => setIsGuestLogin(true)}
              className="bg-teal-700 hover:bg-teal-600"
            >
              {t("loginAsGuest")}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default LoginForm;
