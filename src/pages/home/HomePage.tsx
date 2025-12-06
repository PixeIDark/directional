import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col">
      <Link to="/posts" className="text-green-600">
        게시판
      </Link>
      <Link to="/charts" className="text-blue-600">
        데이터 시각화
      </Link>
    </div>
  );
}

export default HomePage;
