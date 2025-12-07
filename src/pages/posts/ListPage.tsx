import { type GetPostsParams, postsApi } from "../../api/posts.ts";
import { Link } from "react-router-dom";
import { PATHS } from "../../router/path.ts";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Post, Category } from "../../types/post.ts";
import { CATEGORIES } from "../../constants/post.ts";

type ColumnKey = "id" | "title" | "category" | "tags" | "userId" | "createdAt";

const CATEGORY_COLORS = {
  NOTICE: "bg-red-100 text-red-700",
  QNA: "bg-blue-100 text-blue-700",
  FREE: "bg-green-100 text-green-700",
};

const MIN_COLUMN_WIDTHS: Record<ColumnKey, number> = {
  id: 5,
  title: 6,
  category: 9,
  tags: 7,
  userId: 8,
  createdAt: 10,
};

const STORAGE_KEY = "post-list-column-widths";

const loadColumnWidths = (): Record<ColumnKey, number> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("로컬스토리지 로드 실패:", error);
  }
  return {
    id: 8,
    title: 45,
    category: 10,
    tags: 10,
    userId: 10,
    createdAt: 14,
  };
};

const saveColumnWidths = (widths: Record<ColumnKey, number>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
  } catch (error) {
    console.error("로컬스토리지 저장 실패:", error);
  }
};

function ListPage() {
  const [list, setList] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const [filters, setFilters] = useState({
    sort: "createdAt" as "createdAt" | "title",
    order: "desc" as "desc" | "asc",
    category: undefined as Category | undefined,
    search: "",
  });

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    category: true,
    tags: true,
    userId: true,
    createdAt: true,
  });

  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>(loadColumnWidths());

  const [resizing, setResizing] = useState<{
    leftColumn: ColumnKey | null;
    rightColumn: ColumnKey | null;
    startX: number;
    leftStartWidth: number;
    rightStartWidth: number;
  }>({ leftColumn: null, rightColumn: null, startX: 0, leftStartWidth: 0, rightStartWidth: 0 });

  const fetchPosts = useCallback(
    async (cursor?: string | null) => {
      setIsLoading(true);
      try {
        const params: GetPostsParams = {
          limit: 30,
          sort: filters.sort,
          order: filters.order,
          category: filters.category,
          search: filters.search,
          nextCursor: cursor ?? undefined,
        };

        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        if (cursor) params.nextCursor = cursor;

        const res = await postsApi.getList(params);
        setList((prev) => (cursor ? [...prev, ...res.items] : res.items));
        setNextCursor(res.nextCursor);
      } catch (error) {
        console.error("로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoading) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [nextCursor, isLoading, fetchPosts]);

  useEffect(() => {
    if (!resizing.leftColumn || !resizing.rightColumn) return;

    const leftColumn = resizing.leftColumn;
    const rightColumn = resizing.rightColumn;

    const handleMouseMove = (e: MouseEvent) => {
      if (!tableRef.current) return;

      const tableWidth = tableRef.current.offsetWidth;
      const diff = e.clientX - resizing.startX;
      const diffPercent = (diff / tableWidth) * 100;

      const leftMin = MIN_COLUMN_WIDTHS[leftColumn];
      const rightMin = MIN_COLUMN_WIDTHS[rightColumn];

      const totalWidth = resizing.leftStartWidth + resizing.rightStartWidth;

      let newLeftWidth = resizing.leftStartWidth + diffPercent;
      let newRightWidth = resizing.rightStartWidth - diffPercent;

      if (newLeftWidth < leftMin) {
        newLeftWidth = leftMin;
        newRightWidth = totalWidth - leftMin;
      }
      if (newRightWidth < rightMin) {
        newRightWidth = rightMin;
        newLeftWidth = totalWidth - rightMin;
      }

      setColumnWidths((prev) => ({
        ...prev,
        [leftColumn]: newLeftWidth,
        [rightColumn]: newRightWidth,
      }));
    };

    const handleMouseUp = () =>
      setResizing({ leftColumn: null, rightColumn: null, startX: 0, leftStartWidth: 0, rightStartWidth: 0 });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  useEffect(() => {
    saveColumnWidths(columnWidths);
  }, [columnWidths]);

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFilters({
      search: (formData.get("search") as string) || "",
      category: (formData.get("category") as Category) || undefined,
      sort: (formData.get("sort") as "createdAt" | "title") || "createdAt",
      order: (formData.get("order") as "asc" | "desc") || "desc",
    });
    setList([]);
    setNextCursor(null);
  };

  const handleSort = (column: "createdAt" | "title") => {
    setFilters((prev) => ({
      ...prev,
      sort: column,
      order: prev.sort === column && prev.order === "asc" ? "desc" : "asc",
    }));
    setList([]);
    setNextCursor(null);
  };

  const toggleColumn = (column: ColumnKey) => setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));

  const startResize = (leftColumn: ColumnKey, rightColumn: ColumnKey, e: React.MouseEvent) => {
    e.preventDefault();
    setResizing({
      leftColumn,
      rightColumn,
      startX: e.clientX,
      leftStartWidth: columnWidths[leftColumn],
      rightStartWidth: columnWidths[rightColumn],
    });
  };

  const columns: { key: ColumnKey; label: string; sortable?: boolean }[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "제목", sortable: true },
    { key: "category", label: "카테고리" },
    { key: "tags", label: "태그" },
    { key: "userId", label: "작성자" },
    { key: "createdAt", label: "작성일", sortable: true },
  ];

  const visibleColumnKeys = columns.filter((col) => visibleColumns[col.key]).map((col) => col.key);

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">게시글 목록</h1>
        <Link to={PATHS.POSTS.NEW} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          글쓰기
        </Link>
      </div>
      <form onSubmit={handleFilterSubmit} className="mb-4 flex gap-2">
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
        <select name="sort" defaultValue={filters.sort} className="rounded border px-3 py-2">
          <option value="createdAt">작성일</option>
          <option value="title">제목</option>
        </select>
        <select name="order" defaultValue={filters.order} className="rounded border px-3 py-2">
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>
        <button type="submit" className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">
          검색
        </button>
      </form>
      <div className="mb-4 flex gap-4">
        <span className="font-semibold">컬럼:</span>
        {columns.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-1">
            <input type="checkbox" checked={visibleColumns[key]} onChange={() => toggleColumn(key)} />
            {label}
          </label>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full border-collapse border" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="bg-gray-100">
              {columns.map(({ key, label, sortable }) => {
                if (!visibleColumns[key]) return null;
                const currentIndex = visibleColumnKeys.indexOf(key);
                const nextKey = visibleColumnKeys[currentIndex + 1];
                return (
                  <th
                    key={key}
                    className="relative border px-4 py-2 text-left"
                    style={{ width: `${columnWidths[key]}%` }}
                  >
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {sortable ? (
                        <button
                          onClick={() => {
                            if (key === "createdAt" || key === "title") handleSort(key);
                          }}
                          className="flex items-center gap-1 hover:text-blue-600"
                        >
                          {label}
                          {filters.sort === key && <span>{filters.order === "asc" ? "↑" : "↓"}</span>}
                        </button>
                      ) : (
                        label
                      )}
                    </div>
                    {nextKey && (
                      <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-gray-300 hover:bg-blue-500"
                        onMouseDown={(e) => startResize(key, nextKey, e)}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {list.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                {visibleColumns.id && (
                  <td className="overflow-hidden border px-4 py-2 text-ellipsis whitespace-nowrap">
                    <Link to={PATHS.POSTS.DETAIL(post.id)} state={post} className="text-blue-600 hover:underline">
                      {post.id}
                    </Link>
                  </td>
                )}
                {visibleColumns.title && (
                  <td className="overflow-hidden border px-4 py-2 text-ellipsis whitespace-nowrap">
                    <Link to={PATHS.POSTS.DETAIL(post.id)} state={post} className="text-blue-600 hover:underline">
                      {post.title}
                    </Link>
                  </td>
                )}
                {visibleColumns.category && (
                  <td className="border px-4 py-2">
                    <span className={`rounded px-2 py-1 text-xs ${CATEGORY_COLORS[post.category]}`}>
                      {post.category}
                    </span>
                  </td>
                )}
                {visibleColumns.tags && (
                  <td className="border px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="rounded bg-gray-200 px-2 py-0.5 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
                {visibleColumns.userId && (
                  <td className="overflow-hidden border px-4 py-2 text-ellipsis whitespace-nowrap">{post.userId}</td>
                )}
                {visibleColumns.createdAt && (
                  <td className="overflow-hidden border px-4 py-2 text-ellipsis whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleString("ko-KR")}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {nextCursor && (
        <div ref={observerRef} className="py-4 text-center">
          {isLoading && "로딩 중..."}
        </div>
      )}
      {!nextCursor && list.length > 0 && <div className="py-4 text-center text-gray-500">마지막 게시글</div>}
      {!isLoading && list.length === 0 && <div className="py-8 text-center text-gray-500">게시글 없음</div>}
    </div>
  );
}

export default ListPage;
