import React from "react";
import { useCookieConsent } from "../hooks/useCookieConsent";

export default function CookieManager() {
  const { consent, acceptCookies, declineCookies, resetConsent, hasConsented } =
    useCookieConsent();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-accent">
            Gestion des cookies
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Gérez vos préférences concernant l'utilisation des cookies sur
            WebComInk
          </p>
        </div>
      </div>

      <div className="bg-dark-bg/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-white">Statut actuel</h4>
            <p className="text-sm text-gray-400">
              {consent === "accepted" && "✅ Cookies acceptés"}
              {consent === "declined" && "❌ Cookies refusés"}
              {consent === null && "⏳ Aucune décision prise"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {consent === null && (
            <div className="flex gap-2">
              <button
                onClick={acceptCookies}
                className="px-4 py-2 bg-accent text-dark-bg rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium"
              >
                Accepter les cookies
              </button>
              <button
                onClick={declineCookies}
                className="px-4 py-2 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Refuser les cookies
              </button>
            </div>
          )}

          {consent !== null && (
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                {consent === "accepted"
                  ? "Vous avez accepté l'utilisation des cookies. Le site fonctionne avec toutes ses fonctionnalités."
                  : "Vous avez refusé l'utilisation des cookies. Certaines fonctionnalités peuvent être limitées."}
              </p>
              <button
                onClick={resetConsent}
                className="px-4 py-2 text-accent border border-accent rounded-lg hover:bg-accent/10 transition-colors text-sm font-medium"
              >
                Modifier mes préférences
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-2">
        <p>
          <strong>Cookies essentiels :</strong> Authentification, préférences de
          thème et police, consentement aux cookies. Ces cookies sont
          nécessaires au fonctionnement du site.
        </p>
        <p>
          <strong>Cookies de performance :</strong> Statistiques anonymes pour
          améliorer le site.
        </p>
        <p>
          <strong>Cookies de personnalisation :</strong> Historique de lecture,
          bibliothèque personnelle.
        </p>
      </div>
    </div>
  );
}
