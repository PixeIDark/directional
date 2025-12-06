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

const MAX_TITLE_LENGTH = 80;
const MAX_BODY_LENGTH = 2000;
const MAX_TAGS_COUNT = 5;
const MAX_TAG_LENGTH = 24;

// TODO: NewPage 해야할 것
// 1. 디자인 상향
// 2. 상수 분리
// 3. 입력값 검증 함수로 분리
// 4. 에러 처리
// 5. 컴포넌트 분리
// 6. 훅 분리
// 7. ListPage 낙관적 업데이트 적용하기(오래걸릴듯)
// => await 하고 이동 할꺼면 낙관적 업데이트 없어도되는데 await 없이 바로 이동이면 해줘야함
// | **필드명** | **타입** | **설명** |
// | --- | --- | --- |
// | `id` | String | 고유 식별자 (자동 생성 cuid) |
// | `userId` | String | 작성자 ID (User와 1:N 관계) |
// | `title` | String | 게시글 제목 (최대 80자) |
// | `body` | String | 게시글 본문 (최대 2000자, 금칙어 필터 적용) |
// | `category` | Enum | 카테고리 (`NOTICE`,`QNA`,`FREE`) |
// | `tags` | String[] | 태그 목록 (중복 제거, 최대 5개, 각 24자 이내) |
// | `createdAt` | DateTime | 생성 시각 (자동 생성) |
// 로그아웃 누르면 바로 나가져야함 로그인 상태를 전역으로 가져야할듯
function NewPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .filter((tag, index, self) => self.indexOf(tag) === index);

      const postData = {
        title: title.trim(),
        body: body.trim(),
        tags: tagArray.length > 0 ? tagArray : undefined,
        category: category as Category,
      };

      await postsApi.create(postData);
      navigate(PATHS.POSTS.LIST);
    } catch (error) {
      console.error("게시글 생성 실패:", error);
      alert("게시글 생성에 실패했습니다");
    }
  };

  const hasBannedWord = BEN_WORDS.some((word) => title.includes(word) || body.includes(word) || tags.includes(word));
  const isTitleTooLong = title.length > MAX_TITLE_LENGTH;
  const isBodyTooLong = body.length > MAX_BODY_LENGTH;

  const tagArray = tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  const isTooManyTags = tagArray.length > MAX_TAGS_COUNT;
  const hasInvalidTag = tagArray.some((tag) => tag.length > MAX_TAG_LENGTH);

  const isActive =
    title.trim().length > 0 &&
    !isTitleTooLong &&
    body.trim().length > 0 &&
    !isBodyTooLong &&
    category in CATEGORY_OPTIONS &&
    !hasBannedWord &&
    !isTooManyTags &&
    !hasInvalidTag;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full bg-blue-200 p-1"
          />
          <p className="text-xs text-gray-500">
            {title.length}/{MAX_TITLE_LENGTH}
          </p>
          {isTitleTooLong && (
            <p className="text-sm text-red-500">제목은 최대 {MAX_TITLE_LENGTH}자까지 입력 가능합니다</p>
          )}
        </div>
        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="h-[500px] w-full resize-none bg-blue-200 p-1"
          />
          <p className="text-xs text-gray-500">
            {body.length}/{MAX_BODY_LENGTH}
          </p>
          {isBodyTooLong && <p className="text-sm text-red-500">본문은 최대 {MAX_BODY_LENGTH}자까지 입력 가능합니다</p>}
        </div>
        <div>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={`태그 (쉼표로 구분, 최대 ${MAX_TAGS_COUNT}개, 각 24자)`}
            className="w-full bg-blue-200 p-1"
          />
          {isTooManyTags && <p className="text-sm text-red-500">태그는 최대 {MAX_TAGS_COUNT}개까지 입력 가능합니다</p>}
          {hasInvalidTag && (
            <p className="text-sm text-red-500">각 태그는 최대 {MAX_TAG_LENGTH}자까지 입력 가능합니다</p>
          )}
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="bg-blue-200 p-1">
          <option value="">카테고리 선택</option>
          {Object.entries(CATEGORY_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {hasBannedWord && <p className="text-sm text-red-500">금칙어가 포함되어 있습니다</p>}
        <button disabled={!isActive} type="submit" className="bg-blue-600 p-2 text-white disabled:bg-gray-400">
          게시글 생성
        </button>
      </form>
    </div>
  );
}

export default NewPage;
