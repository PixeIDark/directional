import { postsApi } from "../../api/posts";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="w-full">
      <PostForm onSubmit={handleFormSubmit} submitButtonText="게시글 생성" isLoading={isLoading} />
    </div>
  );
}

export default NewPage;
