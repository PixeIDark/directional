import { type RouteObject } from "react-router-dom";
import { PATHS } from "./path.ts";
import HomePage from "../pages/home/HomePage.tsx";
import ChartsPage from "../pages/charts/ChartsPage.tsx";

export const publicRoutes: RouteObject = {
  children: [
    { path: PATHS.HOME, Component: HomePage },
    { path: PATHS.CHARTS, Component: ChartsPage },
  ],
};
