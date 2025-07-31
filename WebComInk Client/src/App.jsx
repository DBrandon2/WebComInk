import AuthProvider from "./components/providers/AuthProvider";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/providers/ThemeProvider";
import NavBar from "./components/shared/NavBar";
import Footer from "./components/shared/Footer";
import ScrollToTop from "./components/shared/ScrollToTop";
import React, { Suspense } from "react";
import PageLoader from "./components/shared/PageLoader";
import CookieConsent from "./components/CookieConsent";

function App() {
  const location = useLocation();
  // Détecte si on est sur la page de lecture de chapitre
  const isChapterReader = /^\/Comics\/[^/]+\/[^/]+\/chapter\//.test(
    location.pathname
  );
  return (
    <div
      className={`w-full lg:pb-0 ${
        isChapterReader ? "lg:my-0" : "lg:my-[80px]"
      }`}
    >
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <ScrollRestoration />
          <NavBar />
          <Suspense fallback={<PageLoader show={true} />}>
            <Outlet key={location.key} />
          </Suspense>
          {!isChapterReader && <Footer />}
        </AuthProvider>
      </ThemeProvider>
      <CookieConsent />
      <Toaster />
    </div>
  );
}

export default App;
