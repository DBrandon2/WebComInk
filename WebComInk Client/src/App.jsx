import AuthProvider from "./components/providers/AuthProvider";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/providers/ThemeProvider";
import NavBar from "./components/shared/NavBar";
import Footer from "./components/shared/Footer";
// import ScrollToTop from "./components/shared/ScrollToTop";

function App() {
  const location = useLocation();
  return (
    <div className=" w-full pb-[128px] lg:pb-0 lg:my-[80px]">
      <ThemeProvider>
        <AuthProvider>
          {/* <ScrollToTop /> */}
          <ScrollRestoration />
          <NavBar />
          <Outlet key={location.key} />
          <Footer />
        </AuthProvider>
      </ThemeProvider>
      <Toaster />
    </div>
  );
}

export default App;
