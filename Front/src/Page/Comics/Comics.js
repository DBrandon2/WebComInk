import React, { useContext, useState } from 'react'
import styles from "./Comics.module.scss"
import { ApiContext } from "../../context/ApiContext"
// import { useFetchData } from "../../hooks/useFetchData"
// import ComicsItem from './ComicsItem/ComicsItem';

function Comics() {

    // const [filter, setFilter] = useState("");
    // const BASE_API_URL = useContext(ApiContext);

    // const [[comics, setComics]] = useFetchData(
    //     BASE_API_URL,
    //     "comics/getComics"
    //   );

    //   function toggleLikeComics(updatedComics) {
    //     console.log(updatedComics);
    //     setComics(comics.map((c) => (c.id === updatedComics.id ? updatedComics : c)));
    //   }

    
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

            <div className={`${styles.ComicsList}`}>

                {/* {comics
                .filter((c) => c.title.toLowerCase().startsWith(filter))
                .map((comics) => (
                    <ComicsItem key={comics.id} comics={comics} toggleLikeComics={toggleLikeComics}/>
                ))
                } */}
                
            </div>


        </div>

    </div>
  )
}

export default Comics