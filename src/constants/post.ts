import type { Category } from "../types/post.ts";

export const CATEGORIES: Record<Category, string> = {
  NOTICE: "알림",
  QNA: "질문",
  FREE: "자유",
} as const;
