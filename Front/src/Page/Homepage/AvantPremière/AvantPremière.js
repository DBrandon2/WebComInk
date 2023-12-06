import styles from "./AvantPremière.module.scss"
import img from "../../../assets/images/Boruto-Banner-AV.jpg"

function AvantPremière() {
  return (
    <div className={`${styles.mainDiv}`}>
      <div className={`${styles.titleAv}`}>
        <h2 className={`${styles.h2TitleAv}`}>Avant-Première</h2>
        <p>Lire en exclusivité les nouvelles sortie avant leurs parutions officiel !</p>
      </div>

    <div className={`${styles.mangaAv}`}>
      <div className={`${styles.imgAv}`}>
        <img src={img} alt="" />
      </div>
      <div className={`${styles.textAv}`}>
        <div className={`${styles.titleTextAv}`}>
        <h3>BORUTO-TWO BLUE VORTEX-</h3>
        <span>MASASHI KISHIMOTO / MIKIO IKEMOTO</span>
        </div>
        <div className={`${styles.synopsisAv}`}>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita voluptas quia repellat deserunt cum, ipsum adipisci animi, laudantium dolores voluptatum placeat ipsa nostrum quibusdam doloremque aliquid neque quasi. Dolorem, inventore.</p>
        </div>
      </div>
    </div>
    <button className={`whiteButton ${styles.btnAv}`}>
        Découvrir
      </button>
    </div>
  )
}

export default AvantPremière