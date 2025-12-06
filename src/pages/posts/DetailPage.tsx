import { useLocation } from "react-router-dom";
import type { Post } from "../../types/post.ts";

// TODO: 상세
// 로그아웃 누르면 바로 나가져야함 로그인 상태를 전역으로 가져야할듯
function DetailPage() {
  const location = useLocation();
  const board: Post = location.state;

  return (
    <div>
      <p>detail</p>
      <div>
        <h1>{board.title}</h1>
        <p>{board.createdAt}</p>
        <p>{board.body}</p>
        <p>{board.tags}</p>
        <p>{board.category}</p>
      </div>
    </div>
  );
}

export default DetailPage;
