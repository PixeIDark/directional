import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./path";
import HomePage from "../pages/home/HomePage";
import ChartsPage from "../pages/charts/ChartsPage";
import ListPage from "../pages/posts/ListPage";
import NewPage from "../pages/posts/NewPage";
import DetailPage from "../pages/posts/DetailPage";
import EditPage from "../pages/posts/EditPage";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

export const router = createBrowserRouter([
  { path: PATHS.HOME, Component: HomePage },
  { path: PATHS.CHARTS, Component: ChartsPage },
  {
    element: <ProtectedRoute />,
    children: [
      { path: PATHS.POSTS.NEW, Component: NewPage },
      { path: PATHS.POSTS.EDIT(":id"), Component: EditPage },
      { path: PATHS.POSTS.DETAIL(":id"), Component: DetailPage },
      { path: PATHS.POSTS.LIST, Component: ListPage },
    ],
  },
]);
