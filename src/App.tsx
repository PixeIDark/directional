import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import AuthButton from "./layouts/AuthButton";
import { AuthProvider } from "./context/AuthContext.tsx";

function App() {
  return (
    <AuthProvider>
      <div className="relative mx-4">
        <div className="fixed top-0 w-full bg-white text-center">
          <AuthButton />
        </div>
        <div className="flex h-screen flex-col items-center justify-center">
          <RouterProvider router={router} />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
