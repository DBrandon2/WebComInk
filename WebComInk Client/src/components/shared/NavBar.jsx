import React from "react";
import { FaHome } from "react-icons/fa";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { ImBooks } from "react-icons/im";
import { FaUser } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import logo from "../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      {/* NAV MOBILE */}
      <nav className="bg-light-bg w-full h-[64px] fixed bottom-0 lg:hidden">
        <ul className="flex justify-around items-center h-full w-full">
          <li>
            <FaHome className="text-[32px]" />
          </li>
          <li>
            <HiOutlineMagnifyingGlass className="text-[32px]" />
          </li>
          <li>
            <ImBooks className="text-[48px]" />
          </li>
          <li>
            <NavLink to="/login">
              <FaUser className="text-[32px]" />
            </NavLink>
          </li>
          <li>
            <IoSettingsSharp className="text-[32px]" />
          </li>
        </ul>
      </nav>

      {/* NAV DESKTOP */}
      <nav className="hidden lg:flex bg-dark-bg/25 backdrop-blur-lg drop-shadow-lg w-full h-[80px] fixed top-0 z-50">
        <ul className="flex justify-between items-center h-full w-full px-8">
          <li className="flex-1 flex  ">
            <NavLink to="/">
              <img
                src={logo}
                alt=""
                className="w-[70px] h-[70px] transition-transform duration-300 ease-in-out transform hover:scale-120 hover:rotate-[-5deg] z-50"
              />
            </NavLink>
          </li>
          <li className="flex-1 flex justify-around tracking-[0.35rem] font-semibold">
            <NavLink to="/">Accueil</NavLink>
            <NavLink to="/comics">Comics</NavLink>
            <NavLink to="/bibliothèque">Bibliothèque</NavLink>
          </li>
          <li className="flex-1 flex justify-end gap-8 ">
            <a href="">
              <HiOutlineMagnifyingGlass className="text-[32px]" />
            </a>
            <NavLink to="/login">
              <FaUser className="text-[32px]" />
            </NavLink>
            <a href="">
              {" "}
              <IoSettingsSharp className="text-[32px]" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
