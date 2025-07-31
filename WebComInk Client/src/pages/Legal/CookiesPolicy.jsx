import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowBackIos } from "react-icons/md";

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <MdOutlineArrowBackIos className="mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-accent mb-4">
            Politique des Cookies
          </h1>
          <p className="text-gray-300">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-accent mb-3">
              Qu'est-ce qu'un cookie ?
            </h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil
              (ordinateur, tablette, smartphone) lorsque vous visitez un site
              web. Les cookies permettent au site de mémoriser vos préférences
              et d'améliorer votre expérience de navigation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-accent mb-3">
              Comment WebComInk utilise les cookies
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  🍪 Cookies essentiels
                </h3>
                <p>
                  Ces cookies sont nécessaires au fonctionnement du site. Ils
                  incluent :
                </p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>Authentification et sécurité de votre compte</li>
                  <li>Préférences de thème (clair/sombre)</li>
                  <li>Préférences de police (OpenDyslexic)</li>
                  <li>Consentement aux cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  📊 Cookies de performance
                </h3>
                <p>
                  Ces cookies nous aident à comprendre comment vous utilisez le
                  site pour l'améliorer :
                </p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>Statistiques de navigation anonymes</li>
                  <li>Détection des erreurs techniques</li>
                  <li>Optimisation des performances</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  🎯 Cookies de personnalisation
                </h3>
                <p>Ces cookies améliorent votre expérience personnalisée :</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>Historique de lecture</li>
                  <li>Bibliothèque personnelle</li>
                  <li>Préférences d'affichage</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-accent mb-3">
              Gestion de vos cookies
            </h2>
            <div className="space-y-4">
              <p>
                Vous pouvez à tout moment modifier vos préférences concernant
                les cookies :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Dans votre navigateur :</strong> Vous pouvez
                  désactiver les cookies dans les paramètres de votre
                  navigateur, mais cela peut affecter le fonctionnement du site.
                </li>
                <li>
                  <strong>Sur WebComInk :</strong> Vous pouvez révoquer votre
                  consentement en supprimant les cookies de votre navigateur et
                  en rechargeant la page.
                </li>
                <li>
                  <strong>Contact :</strong> Pour toute question concernant les
                  cookies, contactez-nous via la page{" "}
                  <Link to="/Contact" className="text-accent hover:underline">
                    Contact
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-accent mb-3">
              Cookies tiers
            </h2>
            <p>
              WebComInk peut utiliser des services tiers (comme Google
              Analytics) qui placent leurs propres cookies. Ces cookies sont
              soumis aux politiques de confidentialité de ces services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-accent mb-3">
              Durée de conservation
            </h2>
            <p>
              Les cookies de session sont supprimés à la fermeture de votre
              navigateur. Les cookies persistants sont conservés selon leur
              finalité :
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li>Cookies de consentement : 1 an</li>
              <li>Cookies de préférences : 2 ans</li>
              <li>Cookies de performance : 13 mois</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-accent mb-3">
              Vos droits
            </h2>
            <p>Conformément au RGPD, vous avez le droit de :</p>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li>Accéder aux données collectées via les cookies</li>
              <li>Rectifier ces données</li>
              <li>Demander la suppression de ces données</li>
              <li>Vous opposer au traitement de ces données</li>
              <li>Révoquer votre consentement à tout moment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-accent mb-3">Contact</h2>
            <p>
              Pour toute question concernant cette politique des cookies ou pour
              exercer vos droits, contactez-nous via la page{" "}
              <Link to="/Contact" className="text-accent hover:underline">
                Contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
