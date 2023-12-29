import logo from "../../../assets/images/Logo-WebComInk.svg";
import styles from "./NavBar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context";
import SearchBar from "../../SearchBar/SearchBar";
import BurgerMenu from "../../BurgerMenu/BurgerMenu";

export default function NavBar() {
  const { user, setUser } = useContext(AuthContext);
  const [logoClicked, setLogoClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  function handleLogoClick() {
    setLogoClicked(true);
    setTimeout(() => setLogoClicked(false), 300);
  }

  async function ScrollToTop() {
    window.scrollTo(0, 0);
  }

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className={`d-flex jcb ${styles.navposition} ${styles.navbar}`}>
        {isMobile ? (
          <div className={`${styles.mobileNav}`}>
            <BurgerMenu />
            <div onClick={ScrollToTop} className={`${styles.divLogo} `}>
              <NavLink to="/" onClick={handleLogoClick}>
                <img
                  src={logo}
                  className={`${styles.logo} ${
                    logoClicked ? styles.clicked : ""
                  }`}
                ></img>
              </NavLink>
            </div>
            {user ? (
              <NavLink to="/profile">
                <img
                  className={`${styles.profileIcon}`}
                  src={`http://localhost:8000/${user.profilePicture}`}
                  alt=""
                />
              </NavLink>
            ) : (
              <NavLink to="/connexion">
                <FontAwesomeIcon className={`${styles.svg}`} icon={faUser} />
              </NavLink>
            )}
          </div>
        ) : (
          <>
            <div onClick={ScrollToTop} className={`${styles.divLogo} `}>
              <NavLink to="/" onClick={handleLogoClick}>
                <img
                  src={logo}
                  className={`${styles.logo} ${
                    logoClicked ? styles.clicked : ""
                  }`}
                ></img>
              </NavLink>
            </div>
            <div className={`${styles.ulNav} `}>
              <ul className={` d-flex gap2 `}>
                <li onClick={ScrollToTop} className={`${styles.liNav}`}>
                  <NavLink
                    to="/"
                    className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}
                  >
                    Accueil
                  </NavLink>
                </li>
                <li className={`${styles.liNav}`}>
                  <NavLink
                    to="/comics"
                    className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}
                  >
                    Comics
                  </NavLink>
                </li>
                <li className={`${styles.liNav}`}>
                  <NavLink
                    to="/bibliothèque"
                    className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}
                  >
                    Bibliothèque
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className={`${styles.iconNav}`}>
              {user ? (
                <>
                  <SearchBar />

                  <NavLink to="/profile">
                    <img
                      className={`${styles.profileIcon}`}
                      src={`http://localhost:8000/${user.profilePicture}`}
                      alt=""
                    />
                  </NavLink>
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    className={`${styles.svg}`}
                    icon={faMagnifyingGlass}
                  />

                  <NavLink to="/connexion">
                    <FontAwesomeIcon
                      className={`${styles.svg}`}
                      icon={faUser}
                    />
                  </NavLink>
                </>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  );
}
