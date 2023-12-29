import React, { useContext, useEffect, useState } from "react";
import styles from "./Bibliothèque.module.scss";
import { AuthContext } from "../../context";
import ComicsItem from "../Comics/ComicsItem/ComicsItem";
import { fetchBooks } from "../../apis/bookmarks";

function Bibliothèque() {
  const { user } = useContext(AuthContext);
  const [comicsData, setComicsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBooks(user.iduser);
      if (data) {
        setComicsData(data);
        console.log(data);
      }
    };
    fetchData();
  }, []);

  console.log(comicsData);

  return (
    <div className={`${styles.mainDiv}`}>
      <div className={`${styles.title}`}>
        <h1>Bienvenue dans votre Bibliothèque</h1>
        <p>Retrouvez ici toutes les oeuvres que vous voulez suivre.</p>
      </div>
      <div className={`${styles.comicsDiv}`}>
        {comicsData.map((comics, idComics) => (
          <ComicsItem key={idComics} data={comics} />
        ))}
      </div>
    </div>
  );
}

export default Bibliothèque;
