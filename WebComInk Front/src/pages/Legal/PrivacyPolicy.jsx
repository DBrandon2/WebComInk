import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-dark-bg text-white px-6 py-12 max-w-4xl mx-auto font-poppins">
      <h1 className="text-4xl font-montserrat text-accent mb-8 text-center">
        Politique de Protection des Données
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">
          Collecte des données personnelles
        </h2>
        <p className="text-white text-base leading-relaxed">
          WebComInk collecte uniquement les données nécessaires au bon fonctionnement du site et à l'amélioration de l'expérience utilisateur. Ces données comprennent notamment les informations fournies lors de la création d'un compte, telles que votre adresse e-mail et vos préférences.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">
          Utilisation des données
        </h2>
        <p className="text-white text-base leading-relaxed">
          Les données collectées sont utilisées pour gérer votre compte, personnaliser votre expérience sur WebComInk, vous permettre de suivre vos lectures, commenter les chapitres, et vous envoyer des communications importantes liées au service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">Partage des données</h2>
        <p className="text-white text-base leading-relaxed">
          WebComInk ne vend ni ne loue vos données personnelles à des tiers. Toutefois, certaines données peuvent être transmises à MangaDex via leur API pour vous permettre d’accéder aux contenus manga.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">Sécurité des données</h2>
        <p className="text-white text-base leading-relaxed">
          Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">Droits des utilisateurs</h2>
        <p className="text-white text-base leading-relaxed">
          Conformément à la réglementation applicable, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation du traitement, d’opposition, ainsi que du droit à la portabilité de vos données. Vous pouvez exercer ces droits en contactant :{" "}
          <a href="mailto:contact.webcomink@gmail.com" className="text-accent hover:underline">
            contact.webcomink@gmail.com
          </a>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">Cookies</h2>
        <p className="text-white text-base leading-relaxed">
          WebComInk utilise des cookies pour améliorer votre expérience, analyser le trafic et gérer les sessions utilisateur. Vous pouvez gérer vos préférences cookies via les paramètres de votre navigateur.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-montserrat text-accent mb-4">Modifications de la politique</h2>
        <p className="text-white text-base leading-relaxed">
          Cette politique de protection des données peut être modifiée à tout moment. Les changements seront publiés sur cette page et prendront effet immédiatement.
        </p>
      </section>
    </main>
  );
}
