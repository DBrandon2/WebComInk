import styles from "./Populaires.module.scss"
import img1 from "../../../assets/images/Cover-OnePiece.png"
import img2 from "../../../assets/images/Cover-JJK.png"
import img3 from "../../../assets/images/Cover-Dandadan.png"
import img4 from "../../../assets/images/Cover-Kaiju8.jpg"
import img5 from "../../../assets/images/Cover-OshinoKo.jpg"
import { useContext } from "react"
import { ApiContext } from "../../../context/ApiContext"
import useFetchData from "../../../hooks/useFecthData"

export default function Populaires (){
    const BASE_API_URL = useContext(ApiContext);
    
    const [[comics, setComics]] = useFetchData(
        BASE_API_URL,
        "comics/getComics"
      );


    return(
        <div className={`${styles.background}`}> 
            <div className={`d-flex ${styles.title}`}>
                <h1>LES PLUS POPULAIRES</h1>
                <p>Découvre ici les œuvres les plus populaires de la platforme !</p>
            </div>
            <div className={`d-flex align-items-center ${styles.mangaPopulaire}`}>
                <div className={`${styles.mangaA1}`}><img src={comics[0]?.banner} alt="OnePiece" /></div>
                <div className={`d-flex flex-column justify-content-beetwen ${styles.mangaA2}`}>
                    <div className={`d-flex  ${styles.mangaB1}`}>
                        <div className={`${styles.mangaC1}`}><img src={img2} alt="JJK" /></div>
                        <div className={`${styles.mangaC1}`}><img src={img4} alt="Kaiju8" /></div>
                        </div>
                    <div className={`d-flex  ${styles.mangaB2}`}>
                        <div className={`${styles.mangaC1}`}><img src={img3} alt="dandadan" /></div>
                        <div className={`${styles.mangaC1}`}><img src={img5} alt="Oshi no Ko" /></div>
                        </div>
                </div>
            </div>
            <button className={`${styles.btnPopulaire}`}>Découvrir</button>


        </div>
        
    )
}