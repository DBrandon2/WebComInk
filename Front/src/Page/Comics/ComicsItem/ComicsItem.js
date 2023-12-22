import { NavLink } from "react-router-dom";
import { fetchComicsData, incrementViews } from "../../../apis/comics";
import { useContext, useEffect, useState } from "react";
import styles from "./ComicsItem.module.scss"
import { AuthContext } from "../../../context";

function ComicsItem({data}) {
  const {idComics, title, banner, synopsis, author, illustrator, likes, bookmarks, vue} = data
  const [comicsData, setComicsData] = useState([]);
  const { user } = useContext(AuthContext);


    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchComicsData();
            if (data) {
                setComicsData(data);
            }
        };
        fetchData();
    }, []);

    const handleComicClick = async () => {

      const idComics = data.idComics;
      await incrementViews(idComics);
    }

  

    


  return (
    <div className={`${styles.comics}`} onClick={handleComicClick}>
      <div className={`${styles.comicsImg}`}>
      <NavLink to={`../details/${idComics}`}>
        <img src={`http://localhost:8000/${banner}`} alt="Comics" />
      </NavLink>
      <NavLink to={`../details/${idComics}`}>
      <div className={`${styles.infoHover}`}>
        <h2>{title}</h2>
        <p>{author}</p>
        <p>{illustrator}</p>
        <span><i class="fa-solid fa-heart"></i>{likes}  |  <i class="fa-solid fa-bookmark"></i>{bookmarks}  |  <i class="fa-solid fa-eye"></i>{vue}</span>
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