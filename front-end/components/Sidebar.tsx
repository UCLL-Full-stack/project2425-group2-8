import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  User,
  Users,
  Calendar,
  ShoppingCart,
  UtensilsCrossed,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const Sidebar = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();
  
  const { locale, pathname: currentPath, asPath, query } = router;

  const handleLanguageChange = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    router.push({ pathname: currentPath, query }, asPath, { locale: newLocale });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      const role = localStorage.getItem("role");
      if (role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [router.pathname]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <aside className="sidebar">
      <Link href="/profile" className="user-avatar">
        <Avatar>
          {/* Temporary hardcoded image */}
          <AvatarImage src="/user/avatar.jpg" alt="Profile picture" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </Link>
      <Link
        href="/planner"
        className={router.pathname === "/planner" ? "active" : ""}
      >
        <Calendar size={24} />
      </Link>
      <div className="flex-grow"></div>
      <button
        onClick={handleLanguageChange}
        className="flex justify-center items-center w-12 h-12 mb-4 rounded-full text-primary hover:bg-avatar-hover-bg"
        aria-label="Change Language"
      >
        <Globe size={24} />
      </button>

      {/* <Link
        href="/shopping-list"
        className={router.pathname === "/shopping-list" ? "active" : ""}
      >
        <ShoppingCart size={24} />
      </Link>
      <Link
        href="/recipes"
        className={router.pathname === "/recipes" ? "active" : ""}
      >
        <UtensilsCrossed size={24} />
      </Link> */}
      {isAdmin && (
        <Link
          href="/users"
          className={router.pathname === "/users" ? "active" : ""}
        >
          <Users size={24} />
        </Link>
      )}
      <div style={{ flexGrow: 1 }}></div> {/* Move to global */}
      {/* <Link
        href="/profile"
        className={router.pathname === "/profile" ? "active" : ""}
      >
        <Settings size={24} />
      </Link> */}
      <Link
        href="/auth"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("loggedInUser");
          router.push("/auth");
        }}
      >
        <LogOut size={24} />
      </Link>
    </aside>
  );
};

export default Sidebar;
