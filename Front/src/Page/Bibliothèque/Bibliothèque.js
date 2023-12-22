import React, { useContext, useEffect, useState } from 'react'
import styles from "./Bibliothèque.module.scss"
import { AuthContext } from '../../context';

import ComicsItem from '../Comics/ComicsItem/ComicsItem';
import { fetchBooks } from '../../apis/bookmarks';

function Bibliothèque() {
  const { user } = useContext(AuthContext);
  const [comicsData, setComicsData] = useState([]);

  console.log(user.iduser)

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
  
  return (
    <div>
      {comicsData.map((comics, idComics) => (
                    <ComicsItem key={idComics} data={comics}/>
                ))
                }    
    </div>
  )
}

export default Bibliothèque