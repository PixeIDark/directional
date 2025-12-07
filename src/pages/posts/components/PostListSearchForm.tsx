import { CATEGORIES } from "../constants/post.ts";

interface PostListSearchFormProps {
  filters: {
    search: string;
    category?: string;
  };
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function PostListSearchForm({ filters, onSubmit }: PostListSearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-4 flex gap-2">
      <input
        name="search"
        type="text"
        placeholder="제목 또는 본문 검색"
        defaultValue={filters.search}
        className="flex-1 rounded border px-3 py-2"
      />
      <select name="category" defaultValue={filters.category || ""} className="rounded border px-3 py-2">
        <option value="">전체</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">
        검색
      </button>
    </form>
  );
}

export default PostListSearchForm;
