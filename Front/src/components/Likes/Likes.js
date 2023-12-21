import React, { useState, useEffect } from 'react';
import { fetchLikes, addLike, removeLike } from '../../apis/likes';

function Likes({ idComics, iduser }) {
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        fetchLikes(idComics, iduser)
          .then(data => {
              setLikeCount(data.likeCount);
              setIsLiked(data.likeCount === 0);
          })
          .catch(error => console.error('Error fetching likes:', error));
    }, [idComics, iduser]);

    console.log("data:", likeCount)

    const handleLike = async () => {
        try {
            if (isLiked) {
                const success = await removeLike(idComics, iduser);
                if (success) {
                    setLikeCount(prevCount => prevCount - 1);
                    setIsLiked(false);
                }
            } else {
                const success = await addLike(idComics, iduser);
                if (success) {
                    setLikeCount(prevCount => prevCount + 1);
                    setIsLiked(true);
                }
            }
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

  return (
    <div>
      <button onClick={handleLike}>
        {isLiked ? 'Unlike' : 'Like'}
      </button>
      <p>{likeCount}</p>
    </div>
  )
}

export default Likes