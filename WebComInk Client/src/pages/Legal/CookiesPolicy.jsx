import React from "react";

export default function CookiesPolicy() {
  return (
    <main
      className="min-h-screen px-6 py-12 max-w-4xl mx-auto font-poppins text-white"
      style={{ backgroundColor: "var(--color-dark-bg)" }}
    >
      <h1
        className="text-4xl font-montserrat mb-8 text-center"
        style={{ color: "var(--color-accent)" }}
      >
        Politique des Cookies
      </h1>

      <section className="mb-6">
        <p className="leading-relaxed text-base md:text-lg">
          Sur WebComInk, nous utilisons des cookies pour améliorer votre
          expérience utilisateur, analyser le trafic du site et personnaliser
          le contenu.
        </p>
      </section>

      <section className="mb-6">
        <h2
          className="text-2xl font-montserrat mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Que sont les cookies ?
        </h2>
        <p className="leading-relaxed text-base md:text-lg">
          Les cookies sont de petits fichiers texte déposés sur votre appareil
          par les sites web que vous visitez. Ils permettent au site de
          mémoriser vos préférences, d’optimiser les performances et de vous
          offrir un contenu personnalisé.
        </p>
      </section>

      <section className="mb-6">
        <h2
          className="text-2xl font-montserrat mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Types de cookies utilisés
        </h2>
        <ul className="list-disc list-inside leading-relaxed text-base md:text-lg space-y-2">
          <li>
            <strong>Cookies strictement nécessaires :</strong> indispensables
            au fonctionnement du site (par exemple, gestion de session).
          </li>
          <li>
            <strong>Cookies de performance :</strong> permettent de mesurer
            l’audience et d’analyser le comportement des visiteurs.
          </li>
          <li>
            <strong>Cookies fonctionnels :</strong> mémorisent vos choix et
            préférences (langue, thème, etc.).
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2
          className="text-2xl font-montserrat mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Gestion des cookies
        </h2>
        <p className="leading-relaxed text-base md:text-lg">
          Vous pouvez gérer vos préférences en matière de cookies via les
          paramètres de votre navigateur. Vous pouvez également refuser
          l’utilisation des cookies non essentiels sans que cela impacte votre
          navigation sur WebComInk.
        </p>
      </section>

      <section className="mb-6">
        <h2
          className="text-2xl font-montserrat mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Plus d’informations
        </h2>
        <p className="leading-relaxed text-base md:text-lg">
          Pour en savoir plus sur les cookies, vous pouvez consulter le site de la{" "}
          <a
            href="https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            CNIL
          </a>
          .
        </p>
      </section>
    </main>
  );
}
