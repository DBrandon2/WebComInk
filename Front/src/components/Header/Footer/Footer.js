import { NavLink } from "react-router-dom"
import styles from "./Footer.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function Footer() {
  return (
    <footer>
    <div className={`${styles.linksContainer}`}>
        <div className={`${styles.liens}`}>
            <span className={`${styles.footerSpan}`}>WebComInk</span>
            <ul>
                <NavLink to="/Politique-de-confidentialité"><li>Politique de protéction des données</li></NavLink>
                <NavLink to="/CGU"><li>Conditions générales d'utilisation</li></NavLink>
                <NavLink to="/Politique-des-cookies"><li>Politique de cookies</li></NavLink>
            </ul>
        </div>
        <div className={`${styles.liens}`}>
            <span className={`${styles.footerSpan}`}>Liens utiles</span>
            <ul>
                <NavLink to="/Aide-Signalé-un-bug"><li>Aide</li></NavLink>
                <NavLink to="/Aide-Signalé-un-bug"><li>Signaler un bug</li></NavLink>
                <NavLink to="/Mentions-légales"><li>Mention Légales</li></NavLink>      
            </ul>
        </div>
        <div className={`${styles.liens}`}>
            <span className={`${styles.footerSpan}`}>Nous contacter</span>
            <ul>
                <NavLink to="/SAV"><li>SAV</li></NavLink>
                <NavLink to="/Réseaux-Sociaux"><li>Media</li></NavLink>
                <NavLink to="/Partenariat"><li>Partenariats</li></NavLink>
            </ul>
        </div>
    </div>
    <div className={`${styles.bottomFooter}`}>
        <h2 className={`${styles.h2}`}>Rejoins-nous sur </h2>
        <div className={`${styles.reseaux}`}>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-x-twitter"></i>
            <i className="fa-brands fa-discord"></i>
        </div>
    </div>
    </footer>
  )
}

export default Footer