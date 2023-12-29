import React, { useContext, useEffect, useState } from "react";
import styles from "./Details.module.scss";
import { fetchComicsDataOne, fetchChapters } from "../../../apis/comics";
import { Link, useParams } from "react-router-dom";
import Likes from "../../../components/Likes/Likes";
import { AuthContext } from "../../../context";
import { AllLikes, fetchLikes } from "../../../apis/likes";
import Bookmarks from "../../../components/Bookmarks/Bookmarks";
import { AllBooks, fetchBooks, fetchBooksUser } from "../../../apis/bookmarks";

function Details() {
  const [comicsData, setComicsData] = useState([]);
  const [chapters, setChapters] = useState([]);
  const { idComics } = useParams();
  const { user } = useContext(AuthContext);

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [bookCount, setBookCount] = useState(0);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (idComics) {
          const response = await fetchComicsDataOne(idComics);
          if (response && response.length > 0) {
            setComicsData(response);
            const chaptersResponse = await fetchChapters(idComics);
            if (chaptersResponse && chaptersResponse.length > 0) {
              setChapters(chaptersResponse);
              console.log("Chapters:", chaptersResponse);
            } else {
              console.error("No chapters data received.");
            }
          } else {
            console.error("No data received.");
          }

          // Ajout d'une vérification pour s'assurer que user n'est pas null
          if (user && user.iduser) {
            fetchLikes(idComics, user.iduser)
              .then((data) => {
                setIsLiked(data.isLiked);
              })
              .catch((error) => console.error("Error fetching likes:", error));

            fetchBooksUser(idComics, user.iduser)
              .then((data) => {
                setIsBooked(data.isBooked);
              })
              .catch((error) =>
                console.error("Error fetching bookmarks:", error)
              );
          } else {
            console.error("User is null or user.iduser is not defined.");
          }
        } else {
          console.error("idComics is not defined.");
        }
      } catch (error) {
        console.error("Error fetching comics data:", error);
      }
    };
    fetchData();
  }, [idComics, user]);

  function formatDate(dateString) {
    const utcDate = new Date(dateString);
    const formattedDate = utcDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  }

  useEffect(() => {
    AllLikes(idComics)
      .then((data) => {
        setLikeCount(data);
      })
      .catch((error) => {
        console.error("Error fetching all likes:", error);
      });

    AllBooks(idComics)
      .then((data) => {
        setBookCount(data);
      })
      .catch((error) => {
        console.error("Error fetching all bookmarks", error);
      });
  }, [idComics]);

  function handleLikeChange() {
    if (isLiked) {
      setLikeCount((prevLikeCount) => prevLikeCount - 1);
    } else {
      setLikeCount((prevLikeCount) => prevLikeCount + 1);
    }
    setIsLiked(!isLiked);
  }

  function handleBookChange() {
    if (isBooked) {
      setBookCount((prevBookCount) => prevBookCount - 1);
    } else {
      setBookCount((prevBookCount) => prevBookCount + 1);
    }
    setIsBooked(!isBooked);
  }

  return (
    <div className={`${styles.mainDiv}`}>
      <div className={`${styles.headerDiv}`}>
        <img src={`http://localhost:8000/${comicsData[0]?.banner}`} alt="" />
        <div className={`${styles.filter}`}></div>
        <div className={`${styles.headerComponent}`}>
          <h2>{comicsData[0]?.title}</h2>
          <p>{comicsData[0]?.author}</p>
          <p>{comicsData[0]?.illustrator}</p>
        </div>
      </div>
      <div className={`${styles.sectionDiv}`}>
        <div className={`${styles.leftDiv}`}>
          <h2>{comicsData[0]?.title}</h2>
          <ul>
            {chapters.map((chapter) => (
              <Link
                key={chapter.idChapter}
                to={`/chapter/${chapter.idChapter}`}
              >
                <div className={`${styles.chapterLeft}`}>
                  <img
                    src={`http://localhost:8000/${comicsData[0]?.portrait}`}
                    alt=""
                  />
                  <p>{chapter.chapterNb}</p>
                </div>
                <div className={`${styles.chapterRight}`}>
                  <p>{chapter.name}</p>
                  <p>{formatDate(chapter.date)}</p>
                </div>
              </Link>
            ))}
          </ul>
        </div>
        <div className={`${styles.rightDiv}`}>
          {chapters.length > 0 && (
            <Link to={`/chapter/${chapters[0].idChapter}`}>
              <button className={`whiteButton ${styles.rightBtn}`}>
                Lire le premier chapitre
              </button>
            </Link>
          )}
          <div className={`${styles.rightSynopsis}`}>
            <div className={`${styles.numbers}`}>
              <ul>
                <li onClick={handleLikeChange}>
                  <Likes idComics={idComics} iduser={user && user.iduser} />
                  <span>{likeCount}</span>
                </li>

                <li onClick={handleBookChange}>
                  <Bookmarks idComics={idComics} iduser={user && user.iduser} />
                  <span>{bookCount}</span>
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="36"
                    width="36"
                    viewBox="0 0 576 512"
                  >
                    <path
                      fill="#ff9900"
                      d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                    />
                  </svg>
                  <span>{comicsData[0]?.vue}</span>
                </li>
              </ul>
            </div>
            <p>" {comicsData[0]?.synopsis} "</p>
          </div>
          <div className={`${styles.rightAuthors}`}>
            <p>
              Auteur : <span>{comicsData[0]?.author}</span> | Illustrateur :{" "}
              <span>{comicsData[0]?.illustrator}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
