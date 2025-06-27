import React, { useContext } from "react";
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

export default function NavBar() {
  const { user } = useContext(AuthContext);
  const navItems = [
    { to: "/", icon: <FaHome /> },
    { to: "/Comics", icon: <HiOutlineMagnifyingGlass /> },
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
          {navItems.map((item, index) => (
            <NavLink key={index} to={item.to}>
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex items-center justify-center ${
                    isActive ? "text-white" : "text-gray-500"
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
          ))}
        </ul>
      </nav>

      {/* NAV DESKTOP */}
      <nav className="hidden lg:flex bg-dark-bg/25 backdrop-blur-lg drop-shadow-lg w-full h-[80px] fixed top-0 z-50">
        <ul className="flex justify-between items-center h-full w-full px-8">
          <li className="flex-1 flex ">
            <NavLink to="/">
              <img
                src={logo}
                alt=""
                className="w-[70px] h-[70px] transition-transform duration-300 ease-in-out transform hover:scale-120 hover:rotate-[-5deg] z-50"
              />
            </NavLink>
          </li>
          <li className="flex-2 xl:flex-1 flex justify-around tracking-[0.35rem] font-semibold">
            <NavLink to="/">Accueil</NavLink>
            <NavLink to="/Comics">Comics</NavLink>
            <NavLink to="/Bibliothèque">Bibliothèque</NavLink>
          </li>
          <li className="flex-1 flex justify-end items-center gap-8">
            <a href="">
              <HiOutlineMagnifyingGlass className="text-[32px]" />
            </a>
            <NavLink to={user ? "/Profile" : "/Auth"}>
              {/* Affichage conditionnel de l'avatar pour l'icône user */}
              {user ? (
                <img
                  src={user.avatar || defaultAvatar}
                  alt="avatar utilisateur"
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent"
                />
              ) : (
                <FaUser className="text-[32px]" />
              )}
            </NavLink>
            <NavLink to="/Paramètres">
              <IoSettingsSharp className="text-[32px]" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
