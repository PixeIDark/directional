import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import AuthButton from "./layouts/AuthButton";

function App() {
  return (
    <div className="relative mx-4">
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
