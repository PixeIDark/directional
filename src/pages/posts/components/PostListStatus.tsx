interface PostListStatusProps {
  hasNextCursor: boolean;
  isLoading: boolean;
  postCount: number;
  observerRef: React.RefObject<HTMLDivElement>;
}

function PostListStatus({ hasNextCursor, isLoading, postCount, observerRef }: PostListStatusProps) {
  if (hasNextCursor) {
    return (
      <div ref={observerRef} className="py-4 text-center">
        {isLoading && "로딩 중..."}
      </div>
    );
  }
  if (postCount === 0 && !isLoading) return <div className="py-8 text-center text-gray-500">게시글 없음</div>;
  if (postCount > 0) return <div className="py-4 text-center text-gray-500">마지막 게시글</div>;
  return null;
}

export default PostListStatus;
