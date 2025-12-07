import { Link } from "react-router-dom";
import { PATHS } from "../../router/path.ts";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Post } from "./types/post.ts";
import { type GetPostsParams, postsApi } from "../../api/posts.ts";
import Header from "../../components/Header.tsx";
import { useQueryFilters } from "./hooks/useQueryFilters.ts";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll.ts";
import { useColumnResize } from "./hooks/useColumnResize.ts";
import ColumnVisibilityController from "./components/ColumnVisibilityController.tsx";
import PostListStatus from "./components/PostListStatus.tsx";
import PostTableHeader from "./components/PostTableHeader.tsx";
import PostTableBody from "./components/PostTableBody.tsx";
import PostListSearchForm from "./components/PostListSearchForm.tsx";
import PostListSortSelect from "./components/PostListSortSelect.tsx";

type ColumnKey = keyof Omit<Post, "body">;

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "제목" },
  { key: "category", label: "카테고리" },
  { key: "tags", label: "태그" },
  { key: "userId", label: "작성자" },
  { key: "createdAt", label: "작성일" },
] as const;

const MIN_COLUMN_WIDTHS: Record<ColumnKey, number> = {
  id: 5,
  title: 6,
  category: 9,
  tags: 7,
  userId: 8,
  createdAt: 10,
} as const;

const INITIAL_COLUMN_WIDTHS: Record<ColumnKey, number> = {
  id: 8,
  title: 45,
  category: 10,
  tags: 10,
  userId: 10,
  createdAt: 14,
} as const;

function ListPage() {
  const { filters, handleFilterSubmit, handleSortChange } = useQueryFilters();
  const [postList, setPostList] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const { columnWidths, startResize } = useColumnResize<ColumnKey>({
    initialWidths: INITIAL_COLUMN_WIDTHS,
    minWidths: MIN_COLUMN_WIDTHS,
    storageKey: "post-postList-column-widths",
    tableRef,
  });

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    category: true,
    tags: true,
    userId: true,
    createdAt: true,
  });

  const fetchPosts = useCallback(
    async (cursor?: string | null) => {
      setIsLoading(true);
      try {
        const params: GetPostsParams = {
          limit: 30,
          sort: filters.sort,
          order: filters.order,
          nextCursor: cursor ?? undefined,
        };
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;

        const res = await postsApi.getList(params);
        setPostList((prev) => (cursor ? [...prev, ...res.items] : res.items));
        setNextCursor(res.nextCursor);
      } catch (error) {
        console.error("로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters.sort, filters.order, filters.category, filters.search]
  );

  const { observerRef } = useInfiniteScroll({
    fetcher: () => fetchPosts(nextCursor!),
    enabled: !!nextCursor && !isLoading,
  });

  useEffect(() => {
    setPostList([]);
    setNextCursor(null);
    fetchPosts();
  }, [fetchPosts]);

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column as ColumnKey] }));
  };

  const sortValue = `${filters.sort}-${filters.order}`;

  return (
    <div className="h-full">
      <Header title="게시글 조회">
        <Link to={PATHS.POSTS.NEW} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          글쓰기
        </Link>
      </Header>
      <PostListSearchForm filters={filters} onSubmit={handleFilterSubmit} />
      <div className="flex justify-between">
        <ColumnVisibilityController columns={COLUMNS} visibleColumns={visibleColumns} onToggle={toggleColumn} />
        <PostListSortSelect value={sortValue} onChange={handleSortChange} />
      </div>
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full border-collapse border" style={{ tableLayout: "fixed" }}>
          <PostTableHeader
            columns={COLUMNS}
            visibleColumns={visibleColumns}
            columnWidths={columnWidths}
            onResizeStart={startResize}
          />
          <PostTableBody posts={postList} visibleColumns={visibleColumns} />
        </table>
      </div>
      <PostListStatus
        hasNextCursor={!!nextCursor}
        isLoading={isLoading}
        postCount={postList.length}
        observerRef={observerRef}
      />
    </div>
  );
}

export default ListPage;
