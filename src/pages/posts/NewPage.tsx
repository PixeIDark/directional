import { postsApi } from "../../api/posts";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../router/path.ts";
import { type PostFormDataOutput } from "../../schemas/postSchema";
import { useState } from "react";
import PostForm from "./components/PostForm.tsx";
import Header from "../../components/Header.tsx";

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

  const handleClickList = () => {
    if (confirm("작성 중인 내용이 저장되지 않습니다. 이동하시겠습니까?")) navigate(PATHS.POSTS.LIST);
  };

  const handleClickCancel = () => {
    if (confirm("작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?")) navigate(PATHS.POSTS.LIST);
  };

  return (
    <div className="h-full w-full">
      <Header title="게시글 작성">
        <button
          onClick={handleClickList}
          type="button"
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          목록
        </button>
      </Header>
      <PostForm
        onSubmit={handleFormSubmit}
        onCancel={handleClickCancel}
        submitButtonText="등록"
        isLoading={isLoading}
      />
    </div>
  );
}

export default NewPage;
