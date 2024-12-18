import { Recipe } from "../types/recipes";

export type RegisterData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type LoginData = {
  username: string;
  password: string;
};

export type UserTable = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type StatusMessage = {
  message: string;
  type: "error" | "success";
};
