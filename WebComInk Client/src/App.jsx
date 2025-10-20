import AuthProvider from "./components/providers/AuthProvider";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/providers/ThemeProvider";
import NavBar from "./components/shared/NavBar";
import Footer from "./components/shared/Footer";
import ScrollToTop from "./components/shared/ScrollToTop";
import React, { Suspense, useState, useEffect } from "react";
import PageLoader from "./components/shared/PageLoader";
import CookieConsent from "./components/CookieConsent";

function App() {
  const location = useLocation();
  const [isBackendLoading, setIsBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);

  // Fonction pour vérifier la santé du backend
  const checkBackendHealth = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        timeout: 5000, // Timeout de 5 secondes
      });
      if (response.ok) {
        setIsBackendLoading(false);
      } else {
        throw new Error("Backend non prêt");
      }
    } catch (err) {
      // Réessayer après 2 secondes
      setTimeout(checkBackendHealth, 2000);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Détecte si on est sur la page de lecture de chapitre
  const isChapterReader = /^\/Comics\/[^/]+\/[^/]+\/chapter\//.test(
    location.pathname
  );

  if (isBackendLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-bg/90 backdrop-blur-sm">
        <PageLoader show={true} />
        <p className="text-accent text-lg font-bold tracking-widest drop-shadow-lg mt-4">
          L'application se réveille... Cela peut prendre quelques secondes sur Render.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          (Pas de panique, c'est normal pour les déploiements gratuits !)
        </p>
      </div>
    );
  }

  if (backendError) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-bg/90 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold mb-4">Erreur de connexion au serveur</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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
