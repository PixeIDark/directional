interface LogoutButtonProps {
  onLogout: () => void;
}

function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <button type="button" onClick={onLogout}>
      로그아웃
    </button>
  );
}

export default LogoutButton;
