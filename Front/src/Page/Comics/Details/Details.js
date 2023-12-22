import React, { useContext, useEffect, useState } from 'react'
import styles from "./Details.module.scss"
import { fetchComicsDataOne, fetchChapters } from '../../../apis/comics';
import { Link, useParams } from 'react-router-dom';
import Likes from '../../../components/Likes/Likes';
import { AuthContext } from '../../../context';
import { AllLikes, fetchLikes } from '../../../apis/likes';
import Bookmarks from '../../../components/Bookmarks/Bookmarks';
import { AllBooks, fetchBooks } from '../../../apis/bookmarks';


function Details() {
    const [comicsData, setComicsData] = useState([]);
    const [chapters, setChapters] = useState([]);
    const {idComics} = useParams();
    const { user } = useContext(AuthContext);

    const [likeCount, setLikeCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false);

    const [bookCount, setBookCount] = useState(0)
    const [isBooked, setIsBooked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching comics data for idComics:", idComics);
                if (idComics) {
                    const response = await fetchComicsDataOne(idComics);
                    if (response && response.length > 0) {
                        setComicsData(response);
                        const chaptersResponse = await fetchChapters(idComics);
                        if (chaptersResponse && chaptersResponse.length > 0) {
                            setChapters(chaptersResponse);
                            console.log('Chapters:', chaptersResponse);
                        } else {
                            console.error('No chapters data received.');
                        }
                    } else {
                        console.error('No data received.');
                    }

                    fetchLikes(idComics, user.iduser)
                        .then(data => {
                            setIsLiked(data.isLiked);
                        })
                    .catch(error => console.error('Error fetching likes:', error));

                    fetchBooks(idComics, user.iduser)
                    .then(data => {
                        setIsBooked(data.isBooked);
                    })
                .catch(error => console.error('Error fetching bookmarks:', error));


                } else {
                    console.error('idComics is not defined.');
                }
                
            } catch (error) {
                console.error('Error fetching comics data:', error);
            }
        };
        fetchData();
    }, [idComics, user.iduser]);

    function formatDate(dateString) {
        const utcDate = new Date(dateString);
        const formattedDate = utcDate.toLocaleDateString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        return formattedDate;
      }

      useEffect(() => {

        AllLikes(idComics)
          .then(data => {
            console.log("likes is:", data)
            setLikeCount(data);
          })
          .catch(error => {
            console.error('Error fetching all likes:', error);
          });

          AllBooks(idComics)
          .then(data => {
            console.log("bookmarks is:", data)
            setBookCount(data);
          })
          .catch(error => {
            console.error("Error fetching all bookmarks", error)
          })
      }, [idComics]);
      

        function handleLikeChange() {
           if (isLiked) {
            setLikeCount(prevLikeCount => prevLikeCount - 1 );
            } else {
            setLikeCount(prevLikeCount => prevLikeCount + 1 );
            }
            setIsLiked(!isLiked)
      }

      function handleBookChange() {
        if (isBooked) {
         setBookCount(prevBookCount => prevBookCount - 1 );
         } else {
         setBookCount(prevBookCount => prevBookCount + 1 );
         }
         setIsBooked(!isBooked)
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
            <Link key={chapter.idChapter} to={`/chapter/${chapter.idChapter}`}>
                <div className={`${styles.chapterLeft}`}>
                    <img src={`http://localhost:8000/${comicsData[0]?.portrait}`} alt="" />
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
                    <Likes
                        idComics={idComics}
                        iduser={user.iduser}
                         />
                </li>

                <li onClick={handleBookChange}>
                    <Bookmarks
                        idComics={idComics}
                        iduser={user.iduser}
                         />
                </li>
                    {/* <li><i className="fa-solid fa-heart"></i>{comicsData[0]?.likes}</li> */}
                    <li>{likeCount}</li>
                    <li>{bookCount}</li>
                    <li><i className="fa-solid fa-eye"></i>{comicsData[0]?.vue}</li>
                </ul>
            </div>
                <p>" {comicsData[0]?.synopsis} "</p>
            </div>
            <div className={`${styles.rightAuthors}`}>
                <p>Auteur : <span>{comicsData[0]?.author}</span> | Illustrateur : <span>{comicsData[0]?.illustrator}</span></p>
            </div>
        </div>
    </div>
  </div>
  )
}

export default Details