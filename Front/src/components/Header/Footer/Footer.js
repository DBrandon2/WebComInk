import styles from "./Footer.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"



function Footer() {
  return (
    <footer>
    <div className={`${styles.linksContainer}`}>
        <div className={`${styles.liens}`}>
            <span className={`${styles.footerSpan}`}>WebComInk</span>
            <ul>
                <li>Politique de protéction des données</li>
                <li>Conditions générales d'utilisation</li>
                <li>Politique de cookies</li>
            </ul>
        </div>
        <div className={`${styles.liens}`}>
            <span className={`${styles.footerSpan}`}>Liens utiles</span>
            <ul>
                <li>Aide</li>
                <li>Signaler un bug</li>
                <li>Mention Légales</li>
            </ul>
        </div>
        <div className={`${styles.liens}`}>
            <span className={`${styles.footerSpan}`}>Nous contacter</span>
            <ul>
                <li>SAV</li>
                <li>Media</li>
                <li>Partenariats</li>
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