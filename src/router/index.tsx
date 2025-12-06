import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./path.ts";
import HomePage from "../pages/home/HomePage.tsx";
import ChartsPage from "../pages/charts/ChartsPage.tsx";
import ListPage from "../pages/posts/ListPage.tsx";
import NewPage from "../pages/posts/NewPage.tsx";
import DetailPage from "../pages/posts/DetailPage.tsx";
import EditPage from "../pages/posts/EditPage.tsx";

export const router = createBrowserRouter([
  { path: PATHS.HOME, Component: HomePage },
  { path: PATHS.CHARTS, Component: ChartsPage },
  { path: PATHS.POSTS.LIST, Component: ListPage },
  { path: PATHS.POSTS.NEW, Component: NewPage },
  { path: PATHS.POSTS.DETAIL(":id"), Component: DetailPage },
  { path: PATHS.POSTS.EDIT(":id"), Component: EditPage },
]);
