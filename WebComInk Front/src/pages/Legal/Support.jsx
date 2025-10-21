import React from "react";

export default function Support() {
  return (
    <main
      className="min-h-screen px-6 py-12 max-w-4xl mx-auto font-poppins text-white"
      style={{ backgroundColor: "var(--color-dark-bg)" }}
    >
      <h1
        className="text-4xl font-montserrat mb-8 text-center"
        style={{ color: "var(--color-accent)" }}
      >
        Aide & FAQ
      </h1>

      <section className="mb-8">
        <h2
          className="text-2xl font-montserrat mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Comment lire un manga ?
        </h2>
        <p className="leading-relaxed text-base md:text-lg">
          Pour lire un manga, utilisez la barre de recherche ou parcourez les
          catégories pour trouver votre série préférée. Cliquez ensuite sur un
          chapitre pour commencer la lecture.
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="text-2xl font-montserrat mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Comment créer un compte ?
        </h2>
        <p className="leading-relaxed text-base md:text-lg">
          Bien que la lecture soit possible sans compte, créer un compte vous
          permettra de suivre vos mangas, commenter les chapitres, personnaliser
          votre profil et bien plus encore. Cliquez sur l’icône utilisateur en
          haut à droite pour vous inscrire.
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="text-2xl font-montserrat mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Je rencontre un bug, que faire ?
        </h2>
        <p className="leading-relaxed text-base md:text-lg">
          Si vous trouvez un bug ou un problème technique, merci de le signaler
          via notre page{" "}
          <a
            href="/report-bug"
            className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            signalement de bugs
          </a>
          . Votre aide nous permet d’améliorer le site.
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="text-2xl font-montserrat mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Comment contacter le support ?
        </h2>
        <p className="leading-relaxed text-base md:text-lg">
          Pour toute question ou demande d’assistance, vous pouvez nous écrire à{" "}
          <a
            href="mailto:contact.webcomink@gmail.com"
            className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            contact.webcomink@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
