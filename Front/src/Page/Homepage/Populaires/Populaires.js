import { NavLink } from "react-router-dom"
import styles from "./Populaires.module.scss"

export default function Populaires ({comicsData}){
    return(
        <div className={`${styles.background}`}> 
            <div className={`d-flex ${styles.title}`}>
                <h1>LES PLUS POPULAIRES</h1>
                <p>Découvre ici les œuvres les plus populaires de la platforme !</p>
            </div>
            <div className={`d-flex align-items-center ${styles.mangaPopulaire}`}>
                {comicsData && <div className={`${styles.mangaA1}`}><img src={`http://localhost:8000/${comicsData[0]?.portrait}`} alt="OnePiece" /></div>}
                
                <div className={`d-flex flex-column justify-content-beetwen ${styles.mangaA2}`}>
                    <div className={`d-flex  ${styles.mangaB1}`}>   
                    {comicsData && <div className={`${styles.mangaC1}`}><img src={`http://localhost:8000/${comicsData[1]?.banner}`} alt="JJK" /></div>}
                    {comicsData && <div className={`${styles.mangaC1}`}><img src={`http://localhost:8000/${comicsData[3]?.banner}`} alt="Kaiju n°8" /></div>}
                        </div>
                    <div className={`d-flex  ${styles.mangaB2}`}>
                    {comicsData && <div className={`${styles.mangaC1}`}><img src={`http://localhost:8000/${comicsData[2]?.banner}`} alt="DanDaDan" /></div>}
                    {comicsData && <div className={`${styles.mangaC1}`}><img src={`http://localhost:8000/${comicsData[4]?.banner}`} alt="Oshi No Ko" /></div>}
                        </div>
                </div>
            </div>
            
            <NavLink to="comics" className={`whiteButton ${styles.btnPopulaire}`}>Découvrir</NavLink>


        </div>
        
    )
}