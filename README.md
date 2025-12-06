# [Directional] 프론트엔드 채용 과제

안녕하세요. 디렉셔널 프론트엔드 개발팀입니다.

이 과제는 React 기반 웹 애플리케이션 구현 능력, API 연동, 코드 구조화, UI 완성도 등을 **종합적으로 평가**하기 위한 과제입니다.

**제출 방법과 기한, 요구사항을 반드시 확인하여 제출 부탁드립니다.**

# 🧾 제출 방법

| **구분** | **내용** |
| --- | --- |
| **형식** | 개인 GitHub Repository URL |
| **제출 내용** | 소스 코드 전체, README.md 포함 |
| **README 필수 항목** | 프로젝트 실행 방법 / 사용한 기술 스택 / 주요 구현 기능 요약 / (선택사항) 배포 링크 |
| **제출 경로** | 채용 담당자 이메일([ohjin@directional.net](mailto:ohjin@directional.net))로 과제 GitHub URL 전달 |
| **제출 기한** | 지정된 마감일까지 제출 |

# ✅ 필수 기술스택

- React 18버전 이상
- TypeScript
- 그 외 프레임워크, 라이브러리 사용 자유

# 🧩 기능 요구사항

과제는 크게 **2가지 주요 기능**으로 구성되어 있습니다.

API 상세 정보 및 요청 구조는 Swagger 문서를 참고해주세요.

**Swagger URL:** https://fe-hiring-rest-api.vercel.app/docs

### 1. 게시판 기능

제공된 API(`/posts`)를 활용하여 **게시글 작성, 조회, 수정, 삭제(CRUD)** 가 가능한 게시판을 구현합니다.

인증 토큰은 제공된 `email`, `password`를 사용하여 `/auth/login` API를 통해 발급받아 사용하세요.

리퀘스트 헤더 *Authorization*에 `Bearer ${token}` 으로 들어가면 됩니다.

### 📄 게시글 데이터 구조

| **필드명** | **타입** | **설명** |
| --- | --- | --- |
| `id` | String | 고유 식별자 (자동 생성 cuid) |
| `userId` | String | 작성자 ID (User와 1:N 관계) |
| `title` | String | 게시글 제목 (최대 80자) |
| `body` | String | 게시글 본문 (최대 2000자, 금칙어 필터 적용) |
| `category` | Enum | 카테고리 (`NOTICE`,`QNA`,`FREE`) |
| `tags` | String[] | 태그 목록 (중복 제거, 최대 5개, 각 24자 이내) |
| `createdAt` | DateTime | 생성 시각 (자동 생성) |

### 필수 구현 기능

- **게시글 작성 / 조회 / 수정 / 삭제 (CRUD)**
- 게시글 목록을 **테이블 형태**로 표시
- 각 컬럼 별 **넓이 조절 가능**
- 특정 컬럼 **숨김/보임 기능**
- 무한 스크롤 기반 페이지네이션
- **검색**: 제목 및 본문 내용 검색
- **정렬**: `title` 또는 `createdAt` 기준 오름/내림차순
- **필터**: 카테고리(`category`)별 필터링
- **금칙어 필터**: 아래 단어 포함 시 등록 불가`"캄보디아"`, `"프놈펜"`, `"불법체류"`, `"텔레그램"`

## 2. 데이터 시각화 기능

다음 Mock API를 활용하여 데이터를 시각화합니다.

| **엔드포인트** | **차트 종류** |
| --- | --- |
| `/mock/top-coffee-brands` | 바 차트, 도넛 차트 두 가지 |
| `/mock/popular-snack-brands` | 바 차트, 도넛 차트 두 가지 |
| `/mock/weekly-mood-trend` | 스택형 바 차트, 스택형 면적(Stacked Bar/Area) 차트 두 가지 |
| `/mock/weekly-workout-trend` | 스택형 바 차트, 스택형 면적(Stacked Bar/Area) 차트 두 가지 |
| `/mock/coffee-consumption` | 멀티라인(Multi-Line) 차트 |
| `/mock/snack-impact` | 멀티라인(Multi-Line) 차트 |

### 필수 구현 기능

**(1) 바 차트, 도넛 차트 (`/mock/weekly-mood-trend`, `/mock/popular-snack-brands`)**

- 각 데이터 별로 두 가지 차트, 총 4개 차트 구현

**(2) 스택형 바 / 면적 차트 (`/mock/weekly-mood-trend`, `/mock/weekly-workout-trend`)**

- X축: `week`
- Y축: 백분율(%)
- `/mock/weekly-mood-trend` 각 항목(`happy`, `tired`, `stressed`)이 누적(Stacked) 형태로 표시
- `/mock/weekly-workout-trend` 각 항목(`running`, `cycling`, `stretching`)이 누적(Stacked) 형태로 표시
- 각 데이터 별로 두 가지 차트, 총 4개 차트 구현

**(3) 멀티라인 차트 (`/mock/coffee-consumption`, `/mock/snack-impact`)**

- X축: 커피 섭취량(잔/일), 스낵 수
- 왼쪽 Y축: 버그 수(`bugs`), 회의불참(`meetingMissed`)
- 오른쪽 Y축: 생산성 점수(`productivity`), 사기(`morale`)
- 범례(Legend): 팀별 라인 구분
- 각 팀(Frontend, Backend, AI 등)에 대해 **두 개의 라인** 표시
    - 실선: 버그 수, 회의불참
    - 점선: 생산성, 사기
    - 동일 팀은 동일 색상 유지
- 데이터 포인트 마커 표시:
    - 원형 → 버그 수, 회의불참
    - 사각형 → 생산성, 사기
- 데이터 포인트 호버 시 툴팁에 호버된 라인의 포인트 X축에 해당하는 커피 잔수와 버그 수, 생산성 점수를 함께 표시 ( 해당하는 팀의 데이터만 표시되어야 합니다. )
- 각 데이터 별로 차트 구현

**(4) 전체 차트 공통 요구사항**

- **Legend(범례)** 표시 필수
- 범례에서:
    - 색상 변경 가능
    - 데이터 보이기/숨기기 가능

# 게시판 구조

## 페이지 구조
```
조회 페이지 (ListPage.tsx → /posts)
├─ 작성 페이지 (NewPage.tsx → /posts/new)
└─ 상세 페이지 (DetailPage.tsx → /posts/:id)
   └─ 수정 페이지 (EditPage.tsx → /posts/:id/edit)
```

**※ 각 페이지 규모가 커지면 페이지 이름으로 폴더링**

---

## 1. 조회 페이지 (ListPage)

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

---

## 2. 작성 페이지 (NewPage)

**기능:**
- 게시글 작성
- 게시글 등록
- 금칙어 필터: `"캄보디아"`, `"프놈펜"`, `"불법체류"`, `"텔레그램"` 포함 시 등록 불가

---

## 3. 상세 페이지 (DetailPage)

**기능:**
- 게시글 내용 표시
- 게시글 삭제

**네비게이션:**
- 수정 페이지 이동

---

## 4. 수정 페이지 (EditPage)

**기능:**
- 게시글 수정 (초기값: 기존 게시글 내용)
- 게시글 저장
- 취소 시 상세 페이지로 이동

---

## 추가 구현 (시간 여유 시)

1. 모달
2. 토스트

