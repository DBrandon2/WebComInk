import React, { useEffect, useState } from 'react'
import { addBook, fetchBooks, removeBook } from '../../apis/bookmarks';

function Bookmarks({ idComics, iduser }) {
    const [bookCount, setBookCount] = useState(0);
    const [isBooked, setIsBooked] = useState(false);

    useEffect(() => {
        fetchBooks(idComics, iduser)
          .then(data => {
              setBookCount(data.bookCount);
              setIsBooked(data.isBooked);
          })
          .catch(error => console.error('Error fetching bookmarks:', error));
    }, [idComics, iduser]);

    const handleBookmarks = async () => {
        try {
            if (isBooked) {
                await removeBook(idComics, iduser);
                setBookCount(prevCount => prevCount - 1);
                setIsBooked(false);
            } else {
                await addBook(idComics, iduser);
                setBookCount(prevCount => prevCount + 1);
                setIsBooked(true);
            }
        } catch (error) {
            console.error('Erreur lors de la gestion du like :', error);
        }
    };


  return (
    <div onClick={handleBookmarks}>
        {isBooked ? <i className="fa-solid fa-bookmark"></i> : <i className="fa-solid fa-bookmark"></i>}
    </div>
  )
}

export default Bookmarks