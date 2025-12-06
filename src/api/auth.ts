import { apiClient } from "./client.ts";
import type { User } from "../types/user.ts";

interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },
};
