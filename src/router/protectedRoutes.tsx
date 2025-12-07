import NewPage from "../pages/posts/NewPage";
import DetailPage from "../pages/posts/DetailPage";
import EditPage from "../pages/posts/EditPage";
import ListPage from "../pages/posts/ListPage";
import { PATHS } from "./path";
import AuthGuard from "../components/AuthGuard.tsx";
import type { RouteObject } from "react-router-dom";

export const protectedRoutes: RouteObject = {
  element: <AuthGuard />,
  children: [
    { path: PATHS.POSTS.NEW, Component: NewPage },
    { path: PATHS.POSTS.EDIT(":id"), Component: EditPage },
    { path: PATHS.POSTS.DETAIL(":id"), Component: DetailPage },
    { path: PATHS.POSTS.LIST, Component: ListPage },
  ],
};
