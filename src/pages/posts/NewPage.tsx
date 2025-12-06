import { useState } from "react";
import { postsApi } from "../../api/posts";
import type { Category } from "../../types/post.ts";

const CATEGORY_OPTIONS: Record<Category, string> = {
  NOTICE: "알림",
  QNA: "질문",
  FREE: "자유",
} as const;

function NewPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      body,
      tags: tags.split(",").map((t) => t.trim()),
      category: category as Category,
    };

    await postsApi.create(postData);
  };

  const isActive =
    title.trim().length > 0 && body.trim().length > 0 && tags.trim().length > 0 && category in CATEGORY_OPTIONS;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="bg-blue-200 p-1"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="h-[500px] resize-none bg-blue-200 p-1"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="태그 (쉼표로 구분)"
          className="bg-blue-200 p-1"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="bg-blue-200 p-1">
          <option value="">카테고리 선택</option>
          {Object.entries(CATEGORY_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button disabled={!isActive} type="submit" className={`bg-blue-600 disabled:bg-gray-400`}>
          게시글 생성
        </button>
      </form>
    </div>
  );
}

export default NewPage;
