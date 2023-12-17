import React, { useEffect, useState } from 'react'
import styles from "./Details.module.scss"
import { fetchComicsDataOne } from '../../../apis/comics';
import { useParams } from 'react-router-dom';

function Details() {
    const [comicsData, setComicsData] = useState([]);
    const { idComics } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (idComics) {
                    const response = await fetchComicsDataOne(idComics);
                    if (response && response.length > 0) {
                        setComicsData(response);
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
  <div className={`${styles.MainDiv}`}>
    <img src={`http://localhost:8000/${comicsData[0]?.banner}`} alt="" />
    <p>{comicsData[0]?.title}</p>
    <img src={`http://localhost:8000/${comicsData[0]?.portrait}`} alt="" />
    <p>{comicsData[0]?.synopsis}</p>
    <p>{comicsData[0]?.author}</p>
  </div>
  )
}

export default Details