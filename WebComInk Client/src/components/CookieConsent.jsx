import React from "react";
import { Link } from "react-router-dom";
import { useCookieConsent } from "../hooks/useCookieConsent";

export default function CookieConsent() {
  const { needsConsent, acceptCookies, declineCookies, isLoading } =
    useCookieConsent();

  if (isLoading || !needsConsent()) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-lg border-t border-accent/20">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Contenu principal */}
          <div className="flex-1">
            <h3 className="text-accent font-semibold text-lg mb-2">
              🍪 Utilisation des cookies
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience sur
              WebComInk, analyser le trafic et personnaliser le contenu. Ces
              cookies sont essentiels au fonctionnement du site et à la sécurité
              de votre compte.
            </p>
            <div className="mt-3 text-xs text-gray-400">
              <Link
                to="/Politique-de-protection-des-données"
                className="text-accent hover:underline"
              >
                Politique de confidentialité
              </Link>
              {" • "}
              <Link
                to="/Politique-des-Cookies"
                className="text-accent hover:underline"
              >
                Politique des cookies
              </Link>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={declineCookies}
              className="px-6 py-2 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Refuser
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-accent text-dark-bg rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium font-semibold"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
