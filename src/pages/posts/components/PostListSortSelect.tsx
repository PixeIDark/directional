interface PostListSortSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function PostListSortSelect({ value, onChange }: PostListSortSelectProps) {
  return (
    <div className="mb-4 flex justify-end">
      <select value={value} onChange={onChange} className="outline-none focus:ring-0 focus:outline-none">
        <option value="createdAt-desc">작성일 내림차순</option>
        <option value="createdAt-asc">작성일 오름차순</option>
        <option value="title-desc">제목 내림차순</option>
        <option value="title-asc">제목 오름차순</option>
      </select>
    </div>
  );
}

export default PostListSortSelect;
