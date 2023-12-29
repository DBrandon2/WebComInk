import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./BurgerMenu.module.scss";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.burgerMenu} ${isOpen ? styles.open : ""}`}>
      <div className={`${styles.burgerIcon}`} onClick={toggleMenu}>
        <div className={`${styles.burgerName}`}>Menu</div>
        <div className={`${styles.burgerLines}`}></div>
      </div>
      <div className={`${styles.mobileMenu}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={toggleMenu}>
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/comics" onClick={toggleMenu}>
              Comics
            </NavLink>
          </li>
          <li>
            <NavLink to="/bibliothèque" onClick={toggleMenu}>
              Bibliothèque
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;
