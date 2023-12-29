import React, { useState, useEffect, useRef } from "react";
import { fetchLikes, addLike, removeLike } from "../../apis/likes";
import "./Likes.scss";

function Likes({ idComics, iduser }) {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const heartRef = useRef();

  useEffect(() => {
    fetchLikes(idComics, iduser)
      .then((data) => {
        setLikeCount(data.likeCount);
        setIsLiked(data.isLiked);
      })
      .catch((error) => console.error("Error fetching likes:", error));
  }, [idComics, iduser]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await removeLike(idComics, iduser);
        setLikeCount((prevCount) => prevCount - 1);
        setIsLiked(false);
        setIsDisliked(true);
      } else {
        await addLike(idComics, iduser);
        setLikeCount((prevCount) => prevCount + 1);
        setIsLiked(true);
        setIsDisliked(false);
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du like :", error);
    }
  };

  return (
    <div
      className={`mainDiv ${isLiked ? "liked" : ""} ${
        isDisliked ? "disliked" : ""
      }`}
      onClick={handleLike}
    >
      <svg
        className="heart"
        ref={heartRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
          fill={isLiked ? "#FF9900" : "rgb(176, 176, 176)"}
        ></path>
      </svg>
    </div>
  );
}

export default Likes;
