import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserTable } from "../../types/auth";
import { UserOverviewTable } from "../../components/users/UserOverviewTable";
import UserService from "@/services/UserService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "next-i18next";

const Users: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<Array<UserTable>>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState<string | null>(
    null
  );
  const { t } = useTranslation("common");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      setUnauthorizedMessage("You are not authorized to access this page.");
      setTimeout(() => {
        router.push("/planner");
      }, 3000);
    } else {
      setIsAdmin(true);
      getAllUsers();
    }
  }, [router]);

  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const fetchedUsers = await UserService.getAllUsers(token);
        setUsers(fetchedUsers);
      } else {
        console.error("No token found");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  if (unauthorizedMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>{unauthorizedMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{t("users")}</title>
      </Head>
      <main className="flex flex-col items-start justify-start min-h-screen">
        <section className="w-full bg-white p-8 rounded-lg">
          {users.length > 0 && <UserOverviewTable data={users} />}
        </section>
      </main>
    </>
  );
};

export default Users;
