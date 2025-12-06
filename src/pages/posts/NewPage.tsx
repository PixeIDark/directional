import { postsApi } from "../../api/posts";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../router/path.ts";
import { type PostFormDataOutput } from "../../schemas/postSchema";
import { useState } from "react";
import PostForm from "./components/PostForm.tsx";

// TODO: NewPage 해야할 것
// => await 하고 이동 할꺼면 낙관적 업데이트 없어도되는데 await 없이 바로 이동이면 해줘야함
// 로그아웃 누르면 바로 나가져야함 로그인 상태를 전역으로 가져야할듯
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

  return (
    <div className="w-full">
      <PostForm onSubmit={handleFormSubmit} submitButtonText="게시글 생성" isLoading={isLoading} />
    </div>
  );
}

export default NewPage;
