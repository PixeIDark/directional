import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Post } from "../../types/post.ts";
import { PATHS } from "../../router/path.ts";
import { postsApi } from "../../api/posts.ts";

// TODO: 상세
// **기능:**
// - 게시글 내용 표시
// - 게시글 삭제
//
// **네비게이션:**
// - 수정 페이지 이동
// 로그아웃 누르면 바로 나가져야함 로그인 상태를 전역으로 가져야할듯
function DetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const board: Post = location.state;

  const handleRemovePost = async () => {
    await postsApi.delete(board.id);
    navigate(PATHS.POSTS.LIST);
  };

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
      <div className="flex gap-4">
        <Link to={PATHS.POSTS.EDIT(board.id)} className="w-20 bg-blue-600">
          수정
        </Link>
        <button onClick={handleRemovePost} type="button" className="w-20 bg-red-500">
          삭제
        </button>
      </div>
    </div>
  );
}

export default DetailPage;
