import { Link } from "react-router-dom";
import { PATHS } from "../../../router/path.ts";
import type { Post } from "../types/post.ts";

const CATEGORY_COLORS = {
  NOTICE: "bg-red-100 text-red-700",
  QNA: "bg-blue-100 text-blue-700",
  FREE: "bg-green-100 text-green-700",
};

interface PostTableBodyProps {
  posts: Post[];
  visibleColumns: Record<string, boolean>;
}

function PostTableBody({ posts, visibleColumns }: PostTableBodyProps) {
  return (
    <tbody>
      {posts.map((post) => (
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
              <span className={`rounded px-2 py-1 text-xs ${CATEGORY_COLORS[post.category]}`}>{post.category}</span>
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
  );
}

export default PostTableBody;
