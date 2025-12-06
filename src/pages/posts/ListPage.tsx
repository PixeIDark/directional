import { postsApi } from "../../api/posts.ts";
import { Link } from "react-router-dom";
import { PATHS } from "../../router/path.ts";
import { useEffect, useRef, useState } from "react";
import type { Post } from "../../types/post.ts";

/*
TODO: 필수 구현 기능
**기능:**
- 내 게시글 목록 (테이블 형태)
- 컬럼 너비 조절
- 컬럼 숨김/보임
- 무한 스크롤 => nextCursor속성 이용해서 ㄱㄱ
- 정렬: 제목, 작성일 (오름차순/내림차순)
- 검색: 제목, 본문
- 필터: 카테고리

**네비게이션:**
- 작성 페이지 이동
- 상세 페이지 이동

옵저버로 뷰포트 감지해야해서 ui를 우선 크기만큼은 잘 닦아놔야함
limit 개수를 agent 길이에 비례하게 할지?
**/
function ListPage() {
  const [list, setList] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = async () => {
    if (!nextCursor || isLoading) return;

    setIsLoading(true);
    try {
      const res = await postsApi.getList({ limit: 30, nextCursor });
      setList((prev) => [...prev, ...res.items]);
      setNextCursor(res.nextCursor);
    } catch (error) {
      console.error("추가 게시글 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await postsApi.getList({ limit: 30 });
        setList(res.items);
        setNextCursor(res.nextCursor);
      } catch (error) {
        console.error("게시글 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMorePosts();
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loadMorePosts]);

  return (
    <div className="h-full">
      <Link to={PATHS.POSTS.NEW}>글쓰기</Link>
      <p>posts</p>
      {list.map((post) => (
        <Link to={PATHS.POSTS.DETAIL(post.id)} state={post} key={post.id} className="flex gap-4">
          <p className="">{post.id}</p>
          <p className="">{post.title}</p>
          <p>{post.createdAt}</p>
        </Link>
      ))}
      {nextCursor && (
        <div ref={observerRef} className="py-4 text-center">
          {isLoading ? "로딩 중..." : "더 보기"}
        </div>
      )}
      {!nextCursor && list.length > 0 && <div className="py-4 text-center text-gray-500">마지막 게시글입니다</div>}
    </div>
  );
}

export default ListPage;
