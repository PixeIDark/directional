import { useState } from "react";
import { postsApi } from "../../api/posts";
import type { Category } from "../../types/post.ts";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../router/path.ts";

const CATEGORY_OPTIONS: Record<Category, string> = {
  NOTICE: "알림",
  QNA: "질문",
  FREE: "자유",
} as const;

const BEN_WORDS = ["캄보디아", "프놈펜", "불법체류", "텔레그램"];

// TODO: NewPage 해야할 것
// 1. 디자인 상향
// 2. 상수 분리
// 3. 입력값 검증 함수로 분리
// 4. 에러 처리
// 5. 컴포넌트 분리
// 6. 훅 분리
// 7. ListPage 낙관적 업데이트 적용하기(오래걸릴듯)
// => await 하고 이동 할꺼면 낙관적 업데이트 없어도되는데 await 없이 바로 이동이면 해줘야함
function NewPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      body,
      tags: tags.split(",").map((t) => t.trim()),
      category: category as Category,
    };

    await postsApi.create(postData);
    navigate(PATHS.POSTS.LIST);
  };

  const hasBannedWord = BEN_WORDS.some((word) => title.includes(word) || body.includes(word) || tags.includes(word));

  const isActive =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    tags.trim().length > 0 &&
    category in CATEGORY_OPTIONS &&
    !hasBannedWord;

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
        {hasBannedWord && <p className="text-sm text-red-500">금칙어가 포함되어 있습니다</p>}
        <button disabled={!isActive} type="submit" className={`bg-blue-600 disabled:bg-gray-400`}>
          게시글 생성
        </button>
      </form>
    </div>
  );
}

export default NewPage;
