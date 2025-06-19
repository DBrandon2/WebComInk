import React from "react";

export default function BugReport() {
  return (
    <main
      className="min-h-screen px-6 py-12 max-w-3xl mx-auto font-poppins text-white"
      style={{ backgroundColor: "var(--color-dark-bg)" }}
    >
      <h1
        className="text-4xl font-montserrat mb-8 text-center"
        style={{ color: "var(--color-accent)" }}
      >
        Signaler un bug
      </h1>

      <p className="text-center text-lg leading-relaxed max-w-xl mx-auto">
        Pour signaler un bug ou un problème rencontré sur WebComInk, merci de
        nous contacter par email à l'adresse suivante :
      </p>

      <p className="mt-6 text-center text-[var(--color-accent)] text-lg font-semibold">
        <a href="mailto:contact.webcomink@gmail.com" className="underline hover:text-[var(--color-accent-hover)]">
          contact.webcomink@gmail.com
        </a>
      </p>
    </main>
  );
}
