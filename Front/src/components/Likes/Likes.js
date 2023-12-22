import React, { useState, useEffect } from 'react';
import { fetchLikes, addLike, removeLike } from '../../apis/likes';


function Likes({ idComics, iduser }) {
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        fetchLikes(idComics, iduser)
          .then(data => {
              setLikeCount(data.likeCount);
              setIsLiked(data.isLiked);
          })
          .catch(error => console.error('Error fetching likes:', error));
    }, [idComics, iduser]);

    const handleLike = async () => {
      try {
          if (isLiked) {
              await removeLike(idComics, iduser);
              setLikeCount(prevCount => prevCount - 1);
              setIsLiked(false);
          } else {
              await addLike(idComics, iduser);
              setLikeCount(prevCount => prevCount + 1);
              setIsLiked(true);
          }
      } catch (error) {
          console.error('Erreur lors de la gestion du like :', error);
      }
  };

  
  return (
    <div onClick={handleLike}>
        {isLiked ? <i className="fa-solid fa-heart"></i> : <i className="fa-solid fa-heart"></i>}
    </div>
  )
}

export default Likes