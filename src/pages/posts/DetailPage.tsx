import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { Post } from "../../types/post.ts";
import { PATHS } from "../../router/path.ts";
import { postsApi } from "../../api/posts.ts";
import { useState, useEffect } from "react";
import Header from "../../components/Header.tsx";

const CATEGORY_COLORS = {
  NOTICE: "bg-red-100 text-red-700",
  QNA: "bg-blue-100 text-blue-700",
  FREE: "bg-green-100 text-green-700",
};

function DetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Post | null>(location.state);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!board && id) {
        setIsLoading(true);
        setError(null);
        try {
          const post = await postsApi.getDetail(id);
          setBoard(post);
        } catch (err) {
          console.error("게시글 로드 실패:", err);
          setError("게시글을 불러올 수 없습니다.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPost();
  }, [board, id]);

  const handleRemovePost = async () => {
    if (!board) return;

    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await postsApi.delete(board.id);
      navigate(PATHS.POSTS.LIST);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  if (isLoading) return <div className="py-8 text-center">로딩 중...</div>;

  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

  if (!board) return <div className="py-8 text-center text-gray-500">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="h-full w-full">
      <Header title="게시글 상세">
        <Link to={PATHS.POSTS.LIST} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
          목록
        </Link>
      </Header>
      <div className="space-y-6 rounded-lg border border-gray-300 bg-white p-6">
        <div className="border-b pb-4">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-xl font-semibold">{board.title}</h2>
            <span className={`rounded px-2 py-1 text-xs ${CATEGORY_COLORS[board.category]}`}>{board.category}</span>
          </div>
          <p className="text-sm text-gray-500">{new Date(board.createdAt).toLocaleString("ko-KR")}</p>
        </div>
        <div className="min-h-44 whitespace-pre-wrap text-gray-700">{board.body}</div>
        {board.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {board.tags.map((tag, idx) => (
              <span key={idx} className="rounded bg-gray-200 px-2 py-1 text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-row-reverse gap-3">
        <button
          onClick={handleRemovePost}
          type="button"
          className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
        >
          삭제
        </button>
        <Link
          to={PATHS.POSTS.EDIT(board.id)}
          state={board}
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          수정
        </Link>
      </div>
    </div>
  );
}

export default DetailPage;
