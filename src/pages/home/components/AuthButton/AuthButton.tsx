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

      {!isLoggedIn && !isLoading && <LoginButton onLogin={handleLogin} isLoading={false} />}

      {!isLoggedIn && isLoading && (
        <img src="/icon/spinner.svg" alt="로딩중..." className="h-5 w-5 animate-spin text-amber-500" />
      )}
    </div>
  );
}

export default AuthButton;
