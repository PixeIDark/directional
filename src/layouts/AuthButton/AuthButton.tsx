import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useState } from "react";
import { authApi } from "../../api/auth.ts";

const email = "nape1203@gmail.com";
const password = "E8mN0pQrS2";

function AuthButton() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("token") !== null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
  };

  if (isLogin) return <LogoutButton onLogout={handleLogout} />;

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem("token", data.token);
      setIsLogin(true);
    } catch (error) {
      console.error("로그인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return <LoginButton onLogin={handleLogin} isLoading={isLoading} />;
}

export default AuthButton;
