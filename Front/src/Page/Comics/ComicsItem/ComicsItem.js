import { NavLink } from "react-router-dom";
import { fetchComicsData } from "../../../apis/comics";
import { useEffect, useState } from "react";
import styles from "./ComicsItem.module.scss"

function ComicsItem({data}) {
  const {idComics, title, banner, synopsis, author, illustrator, likes, favorite, vue} = data
  const [comicsData, setComicsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchComicsData();
            if (data) {
                setComicsData(data);
            }
        };
        fetchData();
    }, []);

  

    


  return (
    <div className={`${styles.comics}`}>
      <div className={`${styles.comicsImg}`}>
      <NavLink to={`../details/${idComics}`}>
        <img src={`http://localhost:8000/${banner}`} alt="Comics" />
      </NavLink>
      <NavLink to={`../details/${idComics}`}>
      <div className={`${styles.infoHover}`}>
        <h2>{title}</h2>
        <p>{author}</p>
        <p>{illustrator}</p>
        <span><i class="fa-solid fa-heart"></i>{likes}  |  <i class="fa-solid fa-bookmark"></i>{favorite}  |  <i class="fa-solid fa-eye"></i>{vue}</span>
      </div>
      </NavLink>
      </div>
      {/* <div className={`${styles.comicsTitle}`}>
        <h3>{title}</h3>
      </div> */}
    </div>
  )
}

export default ComicsItem