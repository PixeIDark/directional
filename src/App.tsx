import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext.tsx";

function App() {
  return (
    <AuthProvider>
      <div className="relative mx-4">
        <div className="flex h-screen max-w-950 flex-col items-center justify-center">
          <RouterProvider router={router} />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
