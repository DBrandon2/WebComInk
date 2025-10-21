import React from "react";

export default function TermsOfUse() {
  return (
    <main className="min-h-screen bg-dark-bg text-white px-6 py-12 max-w-4xl mx-auto font-poppins">
      <h1 className="text-4xl font-montserrat text-accent mb-8 text-center">
        Conditions Générales d’Utilisation (CGU)
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">
          Présentation du site
        </h2>
        <p className="text-white text-base leading-relaxed">
          WebComInk est un site permettant de lire des scans de mangas en ligne
          et de suivre leurs parutions. Le site s’appuie sur l’API MangaDex pour
          fournir les contenus. Nous ne sommes pas responsables des contenus
          tiers diffusés via cette API.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">
          Accès au service et création de compte
        </h2>
        <p className="text-white text-base leading-relaxed">
          L’accès à la lecture des mangas est libre et ne nécessite pas la
          création d’un compte. Toutefois, créer un compte offre des
          fonctionnalités supplémentaires telles que la gestion de votre
          bibliothèque, le suivi des chapitres lus, la possibilité de commenter,
          et la personnalisation de votre profil.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">
          Commentaires et comportement des utilisateurs
        </h2>
        <p className="text-white text-base leading-relaxed">
          Les utilisateurs peuvent poster des commentaires sur les chapitres.
          Les commentaires doivent respecter la législation en vigueur et ne pas
          contenir de propos injurieux, racistes, discriminatoires,
          diffamatoires, obscènes ou contraires à l’ordre public. Toute
          violation pourra entraîner la suppression du commentaire et, si
          nécessaire, le blocage de l’utilisateur.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">
          Propriété intellectuelle
        </h2>
        <p className="text-white text-base leading-relaxed">
          Les contenus proposés sur WebComInk proviennent de l’API MangaDex.
          Nous respectons leur politique de propriété intellectuelle,
          consultable directement sur leur site. Vous pouvez consulter leur
          politique complète{" "}
          <a
            href="https://mangadex.org/compliance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            ici
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">
          Responsabilités
        </h2>
        <p className="text-white text-base leading-relaxed">
          WebComInk fournit un accès à des contenus tiers via l’API MangaDex.
          Nous ne garantissons pas la disponibilité, la légalité ou la qualité
          des contenus fournis par des tiers. Nous ne sommes pas responsables
          des interruptions, erreurs ou contenus illicites transmis via cette
          API. L’utilisateur est responsable de l’usage qu’il fait des contenus
          proposés.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">
          Modification des CGU
        </h2>
        <p className="text-white text-base leading-relaxed">
          WebComInk se réserve le droit de modifier les présentes conditions
          générales d’utilisation à tout moment. Les modifications seront
          publiées sur cette page et prendront effet immédiatement.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-montserrat text-accent mb-4">Contact</h2>
        <p className="text-white text-base leading-relaxed">
          Pour toute question ou demande relative aux présentes CGU, vous pouvez
          nous contacter à l’adresse suivante :{" "}
          <a
            href="mailto:contact.webcomink@gmail.com"
            className="text-accent hover:underline"
          >
            contact.webcomink@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
