    import logo from "../../../assets/images/Logo-WebComInk.svg"
    import styles from "./NavBar.module.scss"
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
    import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
    import { faUser } from "@fortawesome/free-solid-svg-icons"
    import { NavLink } from "react-router-dom"
    import { useContext, useState } from "react";
    import { AuthContext } from "../../../context";
    import { signout } from "../../../apis/users";
    import SearchBar from "../../SearchBar/SearchBar";



    export default function NavBar () {
        const { user, setUser } = useContext(AuthContext);
        const [logoClicked, setLogoClicked] = useState(false);


        function handleLogoClick() {
            setLogoClicked(true);
            setTimeout(() => setLogoClicked(false), 300);
        }

        async function ScrollToTop() {
            window.scrollTo(0, 0);
        }


        return(
            <nav className={`d-flex jcb ${styles.navposition} ${styles.navbar}`}>
                <div onClick={ScrollToTop} className={`${styles.divLogo} `}>
                <NavLink to="/" onClick={handleLogoClick}>
                        <img src={logo} className={`${styles.logo} ${logoClicked ? styles.clicked : ""}`}></img>
                    </NavLink>
                </div>
                <div className="ulNav">
                    <ul className={` d-flex gap2 `}>
                        <li onClick={ScrollToTop} className={`${styles.liNav}`}><NavLink  to="/" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Accueil</NavLink></li>
                        <li className={`${styles.liNav}`}><NavLink  to="/comics" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Comics</NavLink></li>
                        <li className={`${styles.liNav}`}><NavLink  to="/bibliothèque" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Bibliothèque</NavLink></li>
                    </ul>
                </div>
                <div className={`${styles.iconNav}`}>
                    {user? (
                        <>
                    <SearchBar/>

                    <NavLink to="/profile">
                        <img className={`${styles.profileIcon}`} src={`http://localhost:8000/${user.profilePicture}`} alt="" />
                    </NavLink>
                        </>
                    ) : (
                        <>


                    <FontAwesomeIcon className={`${styles.svg}`} icon={faMagnifyingGlass} />

                    <NavLink to="/connexion">
                        <FontAwesomeIcon className={`${styles.svg}`} icon={faUser} />
                    </NavLink>
                        </>
                    )}
                </div>       
            </nav>
        )
    }