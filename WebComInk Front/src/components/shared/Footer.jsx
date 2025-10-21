import React from "react";
import { BsInstagram } from "react-icons/bs";
import { BsTiktok } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-4 mt-10 lg:flex-row lg:w-full lg:items-start">
        <div className="w-full h-full flex-1 flex flex-col justify-center items-center">
          <p className="w-full text-center py-8 text-accent text-2xl font-medium tracking-widest">
            WebComInk
          </p>
          <ul className="w-full flex flex-col justify-center items-center gap-4 tracking-wider">
            <li>
              <NavLink
                to="/mentions-légales"
                className="hover:text-accent hover:underline"
                aria-label="Mentions Légales"
              >
                Mentions Légales
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Conditions-générales-d'utilisation"
                className="hover:text-accent hover:underline"
                aria-label="Conditions Générales d'Utilisation"
              >
                CGU
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Politique-de-protection-des-données"
                className="hover:text-accent hover:underline"
                aria-label="Politique de protection des données"
              >
                Politique de protection des données
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Politique-des-Cookies"
                className="hover:text-accent hover:underline"
                aria-label="Politique des cookies"
              >
                Politique des cookies
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="w-full h-full flex-1 flex flex-col justify-center items-center">
          <p className="w-full text-center py-8 text-accent text-2xl font-medium tracking-widest">
            Liens Utiles
          </p>
          <ul className="w-full flex flex-col justify-center items-center gap-4 tracking-wider">
            <li>
              <NavLink
                to="Signaler-un-bug"
                className="hover:text-accent hover:underline"
                aria-label="Signaler un bug"
              >
                Signaler un bug
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/API"
                className="hover:text-accent hover:underline"
                aria-label="API"
              >
                API
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Contact"
                className="hover:text-accent hover:underline"
                aria-label="Nous contacter"
              >
                Nous contacter
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/FAQ"
                className="hover:text-accent hover:underline"
                aria-label="FAQ"
              >
                FAQ
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="w-full h-full flex-1 flex flex-col justify-center items-center">
          <p className="w-full text-center py-8 text-accent text-2xl font-medium tracking-widest">
            Pro & Services
          </p>
          <ul className="w-full flex flex-col justify-center items-center gap-4 tracking-wider">
            <li>
              <NavLink
                to="/Aide"
                className="hover:text-accent hover:underline"
                aria-label="Aide"
              >
                Aide
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Media"
                className="hover:text-accent hover:underline"
                aria-label="Media"
              >
                Media
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <p className="w-full text-center py-8 text-accent text-2xl font-medium tracking-widest">
          Rejoins nous sur nos réseaux :
        </p>
        <ul className="flex gap-8">
          <li className="w-15 h-15 flex items-center justify-center">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="transition-colors duration-300 hover:text-accent"
            >
              <BsInstagram className="w-12 h-12" />
            </a>
          </li>
          <li className="w-15 h-15 flex items-center justify-center">
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok"
              className="transition-colors duration-300 hover:text-accent"
            >
              <BsTiktok className="w-12 h-12" />
            </a>
          </li>
          <li className="w-15 h-15 flex items-center justify-center">
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
              className="transition-colors duration-300 hover:text-accent"
            >
              <BsTwitterX className="w-12 h-12" />
            </a>
          </li>
        </ul>
      </div>
      <div className="w-full flex justify-center items-center mt-8 tracking-widest font-light">
        <span>© 2025 WebComInk — Source : MangaDex</span>
      </div>
    </div>
  );
}
