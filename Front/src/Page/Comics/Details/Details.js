import React, { useEffect, useState } from 'react'
import styles from "./Details.module.scss"
import { fetchComicsDataOne, fetchChapters } from '../../../apis/comics';
import { Link, NavLink, useParams } from 'react-router-dom';

function Details() {
    const [comicsData, setComicsData] = useState([]);
    const [chapters, setChapters] = useState([]);
    const { idComics } = useParams();

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
                } else {
                    console.error('idComics is not defined.');
                }
            } catch (error) {
                console.error('Error fetching comics data:', error);
            }
        };
        fetchData();
    }, [idComics]);
    

  return (
  <div className={`${styles.mainDiv}`}>
    <div className={`${styles.headerDiv}`}>
            <img src={`http://localhost:8000/${comicsData[0]?.banner}`} alt="" /> 
            <div className={`${styles.filter}`}>0</div>  
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
                <img src={`http://localhost:8000/${comicsData[0]?.portrait}`} alt="" />
                <p>{chapter.chapterNb}</p>
                <p>{chapter.name}</p>
                <p>{chapter.date}</p>
            </Link>
        ))}
        </ul>
        </div>
        <div className={`${styles.rightDiv}`}>
            <button className={`whiteButton ${styles.rightBtn}`}>Lire le premier chapitre</button>
            <div className={`${styles.rightSynopsis}`}>
            <div className={`${styles.numbers}`}>
                <ul>
                    <li><i className="fa-solid fa-heart"></i>{comicsData[0]?.likes}</li>
                    <li><i className="fa-solid fa-bookmark"></i>{comicsData[0]?.favorite}</li>
                    <li><i className="fa-solid fa-eye"></i>{comicsData[0]?.vue}</li>
                </ul>
            </div>
                <p>" {comicsData[0]?.synopsis} "</p>
            </div>
            <div className={`${styles.rightAuthors}`}>
                <p>Auteur : <span>{comicsData[0]?.author}</span> | Illustrateur : <span>{comicsData[0]?.illustrator}</span></p>
            </div>
        </div>
        {/* <img src={`http://localhost:8000/${comicsData[0]?.portrait}`} alt="" /> */}
    </div>
  </div>
  )
}

export default Details