import styles from "./Comics.module.scss";
import { useEffect, useState } from "react";
import { fetchComicsData, fetchGenresData } from "../../apis/comics";
import ComicsItem from "./ComicsItem/ComicsItem";

function Comics() {
  const [comicsData, setComicsData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const comics = await fetchComicsData(selectedGenre?.id);
      const genres = await fetchGenresData();
      setComicsData(comics);
      setGenres(genres);
    };

    fetchData();
  }, [selectedGenre]);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div className={`${styles.MainDiv}`}>
      <div className={`${styles.Left}`}>
        <div className={`${styles.Genre}`}>
          <h2 className={`${styles.h2Genre}`}>Genres</h2>
          <ul className={`${styles.ulGenre}`}>
            {genres.map((genre, index) => (
              <li
                key={genre.id || index}
                onClick={() => handleGenreChange(genre)}
              >
                <a href="">{genre.name}</a>
              </li>
            ))}
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
          {comicsData.map((comics) => (
            <ComicsItem key={comics.idComics} data={comics} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comics;
