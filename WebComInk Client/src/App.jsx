import AuthProvider from "./components/providers/AuthProvider";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/providers/ThemeProvider";
import NavBar from "./components/shared/NavBar";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 w-full lg:my-[80px]">
      <ThemeProvider>
        <AuthProvider>
          <NavBar />
            <Outlet />
        </AuthProvider>
      </ThemeProvider>
      <Toaster />
    </div>
  );
}

export default App;
