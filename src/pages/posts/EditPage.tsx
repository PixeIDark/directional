import PostForm from "./components/PostForm.tsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PostFormDataOutput } from "../../schemas/postSchema.ts";
import { postsApi } from "../../api/posts.ts";
import { PATHS } from "../../router/path.ts";
import type { Post } from "./types/post.ts";
import Header from "../../components/Header.tsx";

function EditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(location.state);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!post && id) {
        setIsLoading(true);
        try {
          const post = await postsApi.getDetail(id);
          setPost(post);
        } catch (err) {
          console.error("게시글 로드 실패:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPost();
  }, [post, id]);

  if (!id) return null;

  const handleFormSubmit = async (data: PostFormDataOutput) => {
    setIsLoading(true);
    try {
      await postsApi.update(id, data);
      navigate(PATHS.POSTS.DETAIL(id));
    } catch (error) {
      console.error("게시글 생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickList = () => {
    if (confirm("작성 중인 내용이 저장되지 않습니다. 이동하시겠습니까?")) navigate(PATHS.POSTS.LIST);
  };

  const handleClickCancel = () => {
    if (confirm("작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?")) navigate(PATHS.POSTS.DETAIL(id));
  };

  const defaultValue = {
    title: post?.title ?? "",
    body: post?.body ?? "",
    tags: post?.tags.join(", ") ?? "",
    category: post?.category,
  };

  return (
    <div className="h-full w-full">
      <Header title="게시글 수정">
        <button
          onClick={handleClickList}
          type="button"
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          목록
        </button>
      </Header>
      <PostForm
        defaultValues={defaultValue}
        onSubmit={handleFormSubmit}
        onCancel={handleClickCancel}
        submitButtonText="등록"
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditPage;
