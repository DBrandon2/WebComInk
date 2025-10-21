import React, { useContext, useState } from "react";
import { FaHome } from "react-icons/fa";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { ImBooks } from "react-icons/im";
import { FaUser } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import logo from "../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import SearchBar from "./SearchBar";

export default function NavBar() {
  const { user } = useContext(AuthContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navItems = [
    { to: "/", icon: <FaHome /> },
    {
      to: "/Comics",
      icon: <HiOutlineMagnifyingGlass />,
      isSearch: true,
      onClick: () => setIsSearchOpen(!isSearchOpen),
    },
    { to: "/Bibliothèque", icon: <ImBooks /> },
    {
      to: user ? "/Profile" : "/Auth",
      icon: user ? (
        <img
          src={user.avatar || defaultAvatar}
          alt="avatar utilisateur"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <FaUser />
      ),
    },
    { to: "/Paramètres", icon: <IoSettingsSharp /> },
  ];

  return (
    <div>
      {/* NAV MOBILE */}
      <nav className="bg-light-bg w-screen h-[64px] fixed bottom-0 lg:hidden z-50">
        <ul className="flex justify-around items-center h-full w-full relative">
          {navItems.map((item, index) => {
            // Unifier le rendu pour tous les boutons, y compris la recherche
            return (
              <NavLink key={index} to={item.to} onClick={item.onClick}>
                {({ isActive }) => (
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`relative flex items-center justify-center ${
                      isActive ? "text-light-bg" : "text-gray-500"
                    }`}
                  >
                    <motion.div
                      className={`absolute w-15 h-15 rounded-full ${
                        isActive ? "bg-light-bg" : ""
                      }`}
                      animate={{
                        y: isActive ? -30 : 0,
                        scale: isActive ? 1.2 : 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        },
                      }}
                    />
                    <motion.div
                      className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        isActive ? "bg-accent" : ""
                      }`}
                      animate={{
                        y: isActive ? -30 : 0,
                        scale: isActive ? 1.2 : 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        },
                      }}
                    >
                      {/* Affichage de l'icône ou de l'avatar selon le cas, avatar prend toute la div si connecté */}
                      {user && item.to === "/Profile" ? (
                        <img
                          src={user.avatar || defaultAvatar}
                          alt="avatar utilisateur"
                          className="w-full h-full rounded-full object-cover"
                          loading="lazy"
                          decoding="async"
                          width="48"
                          height="48"
                        />
                      ) : React.isValidElement(item.icon) ? (
                        React.cloneElement(item.icon, {
                          className: "text-[32px]",
                        })
                      ) : (
                        item.icon
                      )}
                    </motion.div>

                    {/* Point sous l'icon actif  */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-[5px] w-2 h-2 bg-accent rounded-full"
                        animate={{
                          opacity: isActive ? 1 : 0,
                          transition: { duration: 0.3 },
                        }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </ul>
      </nav>

      {/* NAV DESKTOP */}
      <nav className="hidden lg:flex bg-dark-bg/25 backdrop-blur-lg drop-shadow-lg w-full h-[80px] fixed top-0 z-50">
        <ul className="flex items-center h-full w-full px-8">
          <li className="flex-shrink-0 flex ">
            <NavLink to="/">
              <img
                src={logo}
                alt=""
                className="w-[70px] h-[70px] transition-transform duration-300 ease-in-out transform hover:scale-120 hover:rotate-[-5deg] z-50"
                loading="lazy"
                decoding="async"
                width="70"
                height="70"
              />
            </NavLink>
          </li>
          {/* Bloc central : navigation principale */}
          <li className="flex-1 flex justify-center items-center gap-12 min-w-0 transition-all duration-300">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-all duration-200 px-5 py-3 rounded-md group text-lg ${
                  isActive
                    ? "text-accent font-semibold"
                    : "text-white lg:hover:text-accent lg:hover:scale-105"
                }`
              }
            >
              <span className="relative inline-block">
                Accueil
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[2.5px] w-[120%] bg-accent rounded origin-center scale-x-0 group-hover:scale-x-100 lg:group-hover:scale-x-100 transition-transform duration-200 pointer-events-none"></span>
              </span>
            </NavLink>
            <NavLink
              to="/Comics"
              className={({ isActive }) =>
                `transition-all duration-200 px-5 py-3 rounded-md group text-lg ${
                  isActive
                    ? "text-accent font-semibold"
                    : "text-white lg:hover:text-accent lg:hover:scale-105"
                }`
              }
            >
              <span className="relative inline-block">
                Comics
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[2.5px] w-[120%] bg-accent rounded origin-center scale-x-0 group-hover:scale-x-100 lg:group-hover:scale-x-100 transition-transform duration-200 pointer-events-none"></span>
              </span>
            </NavLink>
            <NavLink
              to="/Bibliothèque"
              className={({ isActive }) =>
                `transition-all duration-200 px-5 py-3 rounded-md group text-lg ${
                  isActive
                    ? "text-accent font-semibold"
                    : "text-white lg:hover:text-accent lg:hover:scale-105"
                }`
              }
            >
              <span className="relative inline-block">
                Bibliothèque
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[2.5px] w-[120%] bg-accent rounded origin-center scale-x-0 group-hover:scale-x-100 lg:group-hover:scale-x-100 transition-transform duration-200 pointer-events-none"></span>
              </span>
            </NavLink>
          </li>
          {/* Bloc droit : SearchBar + profil + paramètres */}
          <li className="flex-shrink-0 flex items-center gap-6 min-w-0 h-full">
            <div className="flex items-center h-full flex-shrink-0">
              <SearchBar
                isOpen={isSearchOpen}
                onToggle={() => setIsSearchOpen(!isSearchOpen)}
                onClose={() => setIsSearchOpen(false)}
              />
            </div>
            <NavLink to={user ? "/Profile" : "/Auth"} className="flex-shrink-0">
              {/* Affichage conditionnel de l'avatar pour l'icône user */}
              {user ? (
                <img
                  src={user.avatar || defaultAvatar}
                  alt="avatar utilisateur"
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="48"
                  height="48"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#23272f]">
                  <FaUser className="text-[28px]" />
                </div>
              )}
            </NavLink>
            <NavLink to="/Paramètres" className="flex-shrink-0">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white hover:bg-white/20 transition-colors duration-200">
                <IoSettingsSharp className="text-[28px]" />
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
