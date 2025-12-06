export const PATHS = {
  HOME: "/",
  CHARTS: "/charts",
  POSTS: {
    LIST: "/posts",
    NEW: "/posts/new",
    DETAIL: (id: string) => `/posts/${id}`,
    EDIT: (id: string) => `/posts/${id}/edit`,
  },
} as const;
