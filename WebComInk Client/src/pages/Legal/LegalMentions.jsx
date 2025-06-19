import React from "react";
import { NavLink } from "react-router-dom";

export default function LegalMentions() {
  return (
    <div
      className="min-h-screen p-8 bg-[var(--color-dark-bg)] text-[var(--color-text-color)] font-poppins"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <h1
        className="text-4xl font-bold mb-8 text-[var(--color-text-title)] text-center"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Mentions Légales
      </h1>

      <section className="max-w-3xl mx-auto space-y-8 leading-relaxed text-sm md:text-base">
        <article>
          <h2
            className="text-2xl font-semibold mb-3 text-[var(--color-text-title)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Éditeur du site
          </h2>
          <p>
            Le site <strong>WebComInk</strong> est un projet personnel développé
            et maintenu par Brandon Demaretz.
          </p>
          <p>
            Contact :{" "}
            <a
              href="mailto:contact.webcomink@gmail.com"
              className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
            >
              contact.webcomink@gmail.com
            </a>
          </p>
        </article>

        <article>
          <h2
            className="text-2xl font-semibold mb-3 text-[var(--color-text-title)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Hébergement
          </h2>
          <p>
            Le site est hébergé par Vercel et Render. Ces services assurent la
            disponibilité et la sécurité des données.
          </p>
        </article>

        <article>
          <h2
            className="text-2xl font-semibold mb-3 text-[var(--color-text-title)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Propriété intellectuelle
          </h2>
          <p>
            Tous les contenus disponibles sur WebComInk respectent la politique
            de propriété intellectuelle de MangaDex. Toute reproduction ou
            diffusion non autorisée est strictement interdite.
          </p>
        </article>

        <article>
          <h2
            className="text-2xl font-semibold mb-3 text-[var(--color-text-title)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Responsabilité
          </h2>
          <p>
            WebComInk s’efforce d’assurer la fiabilité des informations
            publiées. Toutefois, aucune garantie n’est donnée quant à leur
            exactitude ou exhaustivité. L’utilisateur est responsable de l’usage
            qu’il fait des contenus proposés. WebComInk décline toute
            responsabilité pour les dommages indirects ou liés à l’utilisation
            des liens externes.
          </p>
        </article>

        <article>
          <h2
            className="text-2xl font-semibold mb-3 text-[var(--color-text-title)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Données personnelles
          </h2>
          <p>
            La collecte et le traitement des données personnelles sont réalisés
            conformément à notre{" "}
            <a
              href="/privacy-policy"
              className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
            >
              Politique de confidentialité
            </a>
            . Nous nous engageons à protéger vos informations et à respecter
            votre vie privée.
          </p>
        </article>

        <article>
          <h2
            className="text-2xl font-semibold mb-3 text-[var(--color-text-title)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Cookies
          </h2>
          <p>
            Ce site utilise des cookies pour optimiser votre expérience. En
            poursuivant votre navigation, vous acceptez leur utilisation. Plus
            d’informations dans notre{" "}
            <a
              href="/cookie-policy"
              className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
            >
              Politique de cookies
            </a>
            .
          </p>
        </article>

        <article>
          <h2
            className="text-2xl font-semibold mb-3 text-[var(--color-text-title)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Conditions générales d’utilisation
          </h2>
          <p>
            L’utilisation du site WebComInk est soumise aux{" "}
            <NavLink
              to="/Conditions-générales-dutilisation"
              className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
            >
              Conditions générales d’utilisation
            </NavLink>
            , que tout utilisateur s’engage à respecter.
          </p>
        </article>
      </section>
    </div>
  );
}
