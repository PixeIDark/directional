interface LoginButtonProps {
  onLogin: () => void;
  isLoading: boolean;
}

function LoginButton({ onLogin, isLoading }: LoginButtonProps) {
  return (
    <button onClick={onLogin} disabled={isLoading} type="button">
      로그인
    </button>
  );
}

export default LoginButton;
