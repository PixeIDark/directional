import { postsApi } from "../../api/posts";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../router/path.ts";
import { type PostFormDataOutput } from "../../schemas/postSchema";
import { useState } from "react";
import PostForm from "./components/PostForm.tsx";

function NewPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: PostFormDataOutput) => {
    setIsLoading(true);
    try {
      await postsApi.create(data);
      navigate(PATHS.POSTS.LIST);
    } catch (error) {
      console.error("게시글 생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?")) navigate(PATHS.POSTS.LIST);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">게시글 작성</h1>
        <Link to={PATHS.POSTS.LIST} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
          목록
        </Link>
      </div>
      <PostForm onSubmit={handleFormSubmit} onCancel={handleCancel} submitButtonText="등록" isLoading={isLoading} />
    </div>
  );
}

export default NewPage;
