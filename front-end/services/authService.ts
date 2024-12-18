import { RegisterData, LoginData } from "../types/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const register = async (data: RegisterData) => {
  try {
    const response = await fetch(`${apiUrl}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to register");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

const login = async (data: LoginData) => {
  return fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const authService = { register, login };

export default authService;
