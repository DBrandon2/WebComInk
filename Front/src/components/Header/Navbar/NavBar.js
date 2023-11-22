import logo from "../../../assets/images/Logo-WebComInk.svg"
import styles from "./NavBar.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"


export default function NavBar ({
    user,
    seeProfile,
    logout,

}) {



    return(
        <nav className={`d-flex jcb ${styles.navposition} ${styles.navbar}`}>
            <div className={`${styles.divLogo} `}>
               <Link to="/">
                    <img src={logo} className={`${styles.logo} `}></img>
                </Link>
            </div>
            <div className="ulNav">
                <ul className="d-flex gap2 ">
                    {/* <li className={`${styles.liNav}`}><a href="" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Accueil</a></li> */}
                    <li className={`${styles.liNav}`}><Link  to="/Profile" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Profile</Link></li>
                    <li className={`${styles.liNav}`}><Link  to="/Comics" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Comics</Link></li>
                    <li className={`${styles.liNav}`}><a href="" className={`${styles.acustom} ${styles.abtn} ${styles.fromleft}`}>Bibliothèque</a></li>
                </ul>
            </div>
            <div className={`${styles.iconNav}`}>
                {user? (
                    <>
                <a onClick={logout} href="">
                <FontAwesomeIcon className="svg2" icon={faMagnifyingGlass} />
                </a>

                <a onClick={seeProfile} href="">
                <FontAwesomeIcon className="svg2" icon={faUser} />
                </a>
                    </>
                ) : (
                    <>


                   <FontAwesomeIcon className={`${styles.svg}`} icon={faMagnifyingGlass} />

                <Link to="/Connexion">
                    <FontAwesomeIcon className={`${styles.svg}`} icon={faUser} />
                </Link>
                    </>
                )}
            </div>       
        </nav>
    )
}