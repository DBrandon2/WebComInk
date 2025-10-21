import React, { Suspense } from "react";
import ThemeProvider from "./components/providers/ThemeProvider";
import AuthProvider from "./components/providers/AuthProvider";
import NavBar from "./components/shared/NavBar";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";

// Réintégration progressive: Theme + Auth + NavBar + Outlet
export default function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavBar />

        <div className="mt-0 lg:mt-20">
          <Suspense
          fallback={
            <div className="w-full flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-lg font-medium">Chargement...</p>
              </div>
            </div>
          }
        >
          <Outlet key={location.key} />
        </Suspense>
        </div>

        <ScrollRestoration />
      </AuthProvider>
    </ThemeProvider>
  );
}
