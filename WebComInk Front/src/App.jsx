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

        <ScrollRestoration />

        {/* Diagnostic visible en bas pour confirmer le montage */}
        <div style={{ padding: 24, fontFamily: "sans-serif", color: "#fff" }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Diagnostic: App monté</h1>
          <p style={{ opacity: 0.9 }}>Test: Theme + Auth provider encapsulent l'app.</p>
          <p style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
            Recharge la page et dis-moi si tu vois ce message.
          </p>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
