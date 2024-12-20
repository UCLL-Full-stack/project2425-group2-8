import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User, Users, Calendar, LogOut, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "next-i18next";

const AppSidebar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const router = useRouter();

  const { t } = useTranslation("common");
  const { locale, pathname: currentPath, asPath, query } = router;

  useEffect(() => {
    const role = localStorage.getItem("role");
    const userInfo = localStorage.getItem("loggedInUser");
    if (role === "admin") {
      setIsAdmin(true);
    }
    if (userInfo) {
      const { username } = JSON.parse(userInfo);
      setUsername(username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInUser");
    router.push("/auth");
  };

  const sidebarItems = [
    { href: "/planner", icon: Calendar, label: t("planner") },
    ...(isAdmin ? [{ href: "/users", icon: Users, label: t("users") }] : []),
  ];

  return (
    <aside className="bg-gray-900 p-4">
      <div className="flex items-center mb-4">
        <Link
          href="/planner"
          className="flex items-center gap-3 rounded-lg px-3 transition-colors text-white hover:bg-gray-800"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/user/avatar.jpg" alt="Profile picture" />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-white">
            {username.charAt(0).toUpperCase() + username.slice(1)}
          </span>
        </Link>
      </div>

      <nav>
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 pt-4 pb-3 transition-colors text-white hover:bg-gray-800"
          >
            <item.icon className="h-6 w-6" />
            <span>
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </span>
          </Link>
        ))}
        <Link
          href="/auth"
          className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
          <span>
            {t("logout").charAt(0).toUpperCase() + t("logout").slice(1)}
          </span>
        </Link>
      </nav>
    </aside>
  );
};

export default AppSidebar;
