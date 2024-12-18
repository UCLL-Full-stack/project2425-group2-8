import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserTable } from "../../types/auth";
import { UserOverviewTable } from "../../components/users/UserOverviewTable";
import UserService from "@/services/UserService";

const Users: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<Array<UserTable>>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/planner");
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

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <main className="flex flex-col items-center justify-start min-h-screen py-8 bg-gray-100">
        <section className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Users Overview
          </h2>
          {users.length > 0 && <UserOverviewTable data={users} />}
        </section>
      </main>
    </>
  );
};

export default Users;
