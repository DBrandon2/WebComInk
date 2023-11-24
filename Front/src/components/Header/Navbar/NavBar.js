import logo from "../../../assets/images/Logo-WebComInk.svg"
import styles from "./NavBar.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { NavLink } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../../context";
import { signout } from "../../../apis/users";



export default function NavBar () {
    const { user, setUser } = useContext(AuthContext);

    function handleClick() {
        setUser(null)
        signout()
      }


    return(
        <nav className={`d-flex jcb ${styles.navposition} ${styles.navbar}`}>
            <div className={`${styles.divLogo} `}>
               <NavLink to="/">
                    <img src={logo} className={`${styles.logo} `}></img>
                </NavLink>
            </div>
            <div className="ulNav">
                <ul className="d-flex gap2 ">
                    {/* <li className={`${styles.liNav}`}><a href="" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Accueil</a></li> */}
                    <li className={`${styles.liNav}`}><NavLink  to="/profile" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Profile</NavLink></li>
                    <li className={`${styles.liNav}`}><NavLink  to="/comics" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Comics</NavLink></li>
                    <li className={`${styles.liNav}`}><a href="" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Bibliothèque</a></li>
                </ul>
            </div>
            <div className={`${styles.iconNav}`}>
                {user? (
                    <>
                <a href="">
                <FontAwesomeIcon className="svg2" icon={faMagnifyingGlass} />
                </a>

                <NavLink to="/profile">
                <FontAwesomeIcon className="svg2" icon={faUser} />
                </NavLink>
                    </>
                ) : (
                    <>


                   <FontAwesomeIcon className={`${styles.svg}`} icon={faMagnifyingGlass} />

                <NavLink to="/login">
                    <FontAwesomeIcon className={`${styles.svg}`} icon={faUser} />
                </NavLink>
                    </>
                )}
            </div>       
        </nav>
    )
}