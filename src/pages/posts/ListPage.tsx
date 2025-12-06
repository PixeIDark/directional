import { postsApi } from "./api/posts.ts";

/*
TODO: 필수 구현 기능
**기능:**
- 내 게시글 목록 (테이블 형태)
- 컬럼 너비 조절
- 컬럼 숨김/보임
- 무한 스크롤
- 정렬: 제목, 작성일 (오름차순/내림차순)
- 검색: 제목, 본문
- 필터: 카테고리

**네비게이션:**
- 작성 페이지 이동
- 상세 페이지 이동
**/
function ListPage() {
  (async () => {
    const list = await postsApi.getList();
    console.log(list);
  })();

  return (
    <div>
      <p>posts</p>
    </div>
  );
}

export default ListPage;
