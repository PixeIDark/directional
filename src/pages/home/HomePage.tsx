import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function HomePage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const goPosts = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용해주세요.");
      return;
    }
    navigate("/posts");
  };

  return (
    <div className="flex flex-col gap-2">
      <button onClick={goPosts} className="text-green-600 underline">
        게시판
      </button>
      <Link to="/charts" className="text-blue-600 underline">
        데이터 시각화
      </Link>
    </div>
  );
}

export default HomePage;
