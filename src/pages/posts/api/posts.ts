import type { Post, Category } from "../types/post";
import { apiClient } from "../../../api/client.ts";

interface GetPostsParams {
  limit?: number;
  prevCursor?: string;
  nextCursor?: string;
  sort?: "createdAt" | "title";
  order?: "asc" | "desc";
  category?: Category;
  from?: string;
  to?: string;
  search?: string;
}

interface PostListResponse {
  items: Post[];
  nextCursor: string | null;
  prevCursor: string | null;
}

interface PostCreateRequest {
  title: string;
  body: string;
  category: Category;
  tags?: string[];
}

interface PostUpdateRequest {
  title?: string;
  body?: string;
  category?: Category;
  tags?: string[];
}

interface DeleteResponse {
  ok: boolean;
  deleted: number;
}

export const postsApi = {
  getList: async (params?: GetPostsParams) => {
    const { data } = await apiClient.get<PostListResponse>("/posts", { params });
    return data;
  },

  getDetail: async (id: string) => {
    const { data } = await apiClient.get<Post>(`/posts/${id}`);
    return data;
  },

  create: async (postData: PostCreateRequest) => {
    const { data } = await apiClient.post<Post>("/posts", postData);
    return data;
  },

  update: async (id: string, postData: PostUpdateRequest) => {
    const { data } = await apiClient.patch<Post>(`/posts/${id}`, postData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<DeleteResponse>(`/posts/${id}`);
    return data;
  },
};
