import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChartsPage from "./pages/charts/ChartsPage.tsx";
import ListPage from "./pages/posts/ListPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import AuthButton from "./layouts/AuthButton";

const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/charts", Component: ChartsPage },
  { path: "/posts", Component: ListPage },
]);

function App() {
  return (
    <div className="relative">
      <div className="sticky top-0 flex justify-center">
        <AuthButton />
      </div>
      <div className="flex h-screen flex-col items-center justify-center">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
