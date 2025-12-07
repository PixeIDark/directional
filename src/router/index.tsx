import { createBrowserRouter } from "react-router-dom";
import { protectedRoutes } from "./protectedRoutes.tsx";
import { publicRoutes } from "./publicRoutes.tsx";

export const router = createBrowserRouter([publicRoutes, protectedRoutes]);
