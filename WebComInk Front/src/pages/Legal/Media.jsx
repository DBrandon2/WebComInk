import React from "react";
import { FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Media() {
  return (
    <main className="min-h-screen bg-[var(--color-dark-bg)] text-[var(--color-text-color)] px-6 py-12 max-w-5xl mx-auto font-poppins">
      <h1 className="text-4xl font-montserrat text-[var(--color-text-title)] mb-10 text-center">
        Média WebComInk
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-montserrat text-[var(--color-text-title)] mb-5">
          Ressources à télécharger
        </h2>
        <p className="text-white mb-6">
          Retrouvez ici les logos officiels, images et éléments graphiques à
          utiliser pour tout contenu lié à WebComInk.
        </p>
        <ul className="list-disc list-inside space-y-3 text-white">
          <li>
            <a
              href="/media/logo-webcomink.png"
              download
              className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Logo WebComInk (PNG)
            </a>
          </li>
          <li>
            <a
              href="/media/banner-webcomink.jpg"
              download
              className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Bannière WebComInk (JPEG)
            </a>
          </li>
          <li>
            <a
              href="/media/press-kit.zip"
              download
              className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Kit Presse (ZIP)
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-montserrat text-[var(--color-text-title)] mb-5">
          Communiqués de presse
        </h2>
        <p className="text-white mb-6">
          Pour toute demande média, interview ou partenariat, merci de nous
          contacter par email.
        </p>
        <a
          href="mailto:contact.webcomink@gmail.com"
          className="inline-block bg-[var(--color-accent)] text-[var(--color-dark-bg)] px-6 py-3 rounded-md font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          contact.webcomink@gmail.com
        </a>
      </section>

      <section>
        <h2 className="text-2xl font-montserrat text-[var(--color-text-title)] mb-5">
          Réseaux sociaux
        </h2>
        <p className="text-white mb-6">
          Suivez-nous sur nos réseaux sociaux pour ne rien manquer de
          l’actualité WebComInk.
        </p>
        <div className="flex space-x-8 text-[var(--color-text-color)] text-3xl">
          <a
            href="https://www.tiktok.com/@webcomink"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            <FaTiktok />
          </a>
          <a
            href="https://twitter.com/webcomink"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com/webcomink"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            <FaInstagram />
          </a>
        </div>
      </section>
    </main>
  );
}
