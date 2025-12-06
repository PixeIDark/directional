import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChartsPage from "./pages/charts/ChartsPage.tsx";
import PostsPage from "./pages/posts/PostsPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";

const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/charts", Component: ChartsPage },
  { path: "/posts", Component: PostsPage },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
