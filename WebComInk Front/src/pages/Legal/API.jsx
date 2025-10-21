import React from "react";

export default function API() {
  return (
    <main
      className="min-h-screen px-6 py-12 max-w-3xl mx-auto font-poppins text-white"
      style={{ backgroundColor: "var(--color-dark-bg)" }}
    >
      <h1
        className="text-4xl font-montserrat mb-8 text-center"
        style={{ color: "var(--color-accent)" }}
      >
        API
      </h1>

      <section className="text-base leading-relaxed space-y-6">
        <p>
          WebComInk utilise l’API MangaDex pour accéder aux scans de manga et
          fournir un contenu à jour et riche en fonctionnalités. Cette API
          permet de récupérer les chapitres, les couvertures, les informations
          sur les séries et bien plus encore.
        </p>

        <p>
          Nous ne stockons pas les contenus directement, mais nous nous appuyons
          sur MangaDex pour offrir une expérience fluide et légale de lecture en
          ligne.
        </p>

        <p>
          Pour en savoir plus sur l’API MangaDex, vous pouvez consulter leur
          documentation officielle ici :{" "}
          <a
            href="https://api.mangadex.org/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            https://api.mangadex.org/docs/
          </a>
        </p>
      </section>
    </main>
  );
}
