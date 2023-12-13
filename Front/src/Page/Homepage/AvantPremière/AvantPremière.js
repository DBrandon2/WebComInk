import { NavLink } from "react-router-dom"
import styles from "./AvantPremière.module.scss"

function AvantPremière({comicsData}) {
  return (
    <div className={`${styles.mainDiv}`}>
      <div className={`${styles.titleAv}`}>
        <h2 className={`${styles.h2TitleAv}`}>Avant-Première</h2>
        <p>Lire en exclusivité les nouvelles sortie avant leurs parutions officiel !</p>
      </div>

    <div className={`${styles.mangaAv}`}>
      {comicsData &&<div className={`${styles.imgAv}`}>
       <img src={`http://localhost:8000/${comicsData[5]?.portrait}`} alt="Boruto" />
      </div>}
      <div className={`${styles.textAv}`}>
      {comicsData && <div className={`${styles.titleTextAv}`}>
        <h3>{`${comicsData[5]?.title}`}</h3>
        <p><span>{`${comicsData[5]?.author}`}</span> / <span>{`${comicsData[5]?.illustrator}`}</span></p>
      </div>}
      {comicsData && <div className={`${styles.synopsisAv}`}>
          <p>{`${comicsData[5]?.synopsis}`}</p>
      </div>}
      </div>
    </div>
    <NavLink to="/comics" className={`whiteButton ${styles.btnAv}`}> Découvrir </NavLink>
    </div>
  )
}

export default AvantPremière