export type Category = "NOTICE" | "QNA" | "FREE";

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: Category;
  tags: string[];
  createdAt: string;
}
