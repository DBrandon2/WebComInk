import React from "react";
import Breadcrumb from "../../components/shared/Breadcrumb";

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col justify-start items-center px-6 py-12 font-poppins text-white bg-[var(--color-dark-bg)]">
      <Breadcrumb
        items={[{ label: "Accueil", link: "/" }, { label: "Contact" }]}
      />
      <h1 className="text-4xl font-montserrat mb-8 text-center text-[var(--color-accent)]">
        Nous contacter
      </h1>

      <p className="text-lg max-w-xl text-center leading-relaxed">
        Pour toute question, suggestion ou problème, merci de nous contacter par
        mail à l'adresse suivante :{" "}
        <a
          href="mailto:contact.webcomink@gmail.com"
          className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
        >
          contact.webcomink@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
