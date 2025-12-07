import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext.tsx";

function App() {
  return (
    <AuthProvider>
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
