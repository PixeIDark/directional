import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../../context/AuthContext.tsx";

const email = "nape1203@gmail.com";
const password = "E8mN0pQrS2";

function AuthButton() {
  const { isLoggedIn, isLoading, login, logout } = useAuth();

  const handleLogin = () => login(email, password);

  if (isLoggedIn) return <LogoutButton onLogout={logout} />;
  return <LoginButton onLogin={handleLogin} isLoading={isLoading} />;
}

export default AuthButton;
