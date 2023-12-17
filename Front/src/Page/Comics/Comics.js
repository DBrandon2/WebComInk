import styles from "./Comics.module.scss"
import { useEffect, useState } from "react";
import { fetchComicsData } from '../../apis/comics';
import ComicsItem from "./ComicsItem/ComicsItem";

function Comics() {
    const [comicsData, setComicsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchComicsData();
            if (data) {
                setComicsData(data);
                console.log(data);
            }
        };
        fetchData();
    }, []);

  return (
    <div className={`${styles.MainDiv}`}>
        <div className={`${styles.Left}`}>
            <div className={`${styles.Genre}`}>
                <h2 className={`${styles.h2Genre}`}>Genres</h2>
                <ul className={`${styles.ulGenre}`}>
                    <li><a href="">Action</a></li>
                    <li><a href="">Fantasie</a></li>
                    <li><a href="">Thriller</a></li>
                    <li className={`${styles.TDVStyle}`}><a href="">Tranche de vie</a></li>
                    <li><a href="">Sport</a></li>
                    <li><a href="">Romance</a></li>
                    <li><a href="">Comédie</a></li>
                    <li><a href="">Drama</a></li>
                    <li><a href="">Horreur</a></li>
                </ul>
            </div>
        </div>

        <div className={`${styles.Right}`}>

            <div className={`${styles.Trie}`}>
                <p>Trier par :</p>
                <ul className={`${styles.ulTrie}`}>
                    <li>Popularités</li>
                    <li>Nouveautés</li>
                    <li>Exclusivité</li>
                </ul>
            </div>
        {/*  Liste des comics */}
            <div className={`${styles.gridComics}`}>
                {comicsData.map((comics, idComics) => (
                    <ComicsItem key={idComics} data={comics}/>
                ))
                }    
            </div>
        </div>
    </div>
  )
}

export default Comics