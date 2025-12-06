import { apiClient } from "./client.ts";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
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
