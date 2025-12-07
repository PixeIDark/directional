import { useSearchParams } from "react-router-dom";
import type { Category } from "../../types/post.ts";

export function useQueryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    sort: (searchParams.get("sort") as "createdAt" | "title") || "createdAt",
    order: (searchParams.get("order") as "desc" | "asc") || "desc",
    category: searchParams.get("category") as Category | undefined,
    search: searchParams.get("search") || "",
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newParams: Record<string, string> = {};
    const search = formData.get("search") as string;
    const category = formData.get("category") as string;

    if (search) newParams.search = search;
    if (category) newParams.category = category;
    if (filters.sort) newParams.sort = filters.sort;
    if (filters.order) newParams.order = filters.order;

    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sort, order] = e.target.value.split("-") as ["createdAt" | "title", "asc" | "desc"];
    const newParams: Record<string, string> = { sort, order };

    if (filters.search) newParams.search = filters.search;
    if (filters.category) newParams.category = filters.category;

    setSearchParams(newParams);
  };

  return { filters, handleFilterSubmit, handleSortChange };
}
