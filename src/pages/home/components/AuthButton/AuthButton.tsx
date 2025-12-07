import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../../../../context/AuthContext.tsx";

const email = "nape1203@gmail.com";
const password = "E8mN0pQrS2";

function AuthButton() {
  const { isLoggedIn, isLoading, login, logout } = useAuth();

  const handleLogin = () => login(email, password);

  return (
    <div className="flex justify-center text-amber-500 underline">
      {isLoggedIn && <LogoutButton onLogout={logout} />}
      {!isLoggedIn && <LoginButton onLogin={handleLogin} isLoading={isLoading} />}
    </div>
  );
}

export default AuthButton;
