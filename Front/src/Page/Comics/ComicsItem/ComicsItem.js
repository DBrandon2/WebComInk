import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ApiContext } from "../../../context/ApiContext"

function ComicsItem({comics, toggleLikeComics}) {

    const {id, title, banner, like } = comics;
    const BASE_API_URL = useContext(ApiContext);

    const handleClick = async () => {
        const response = await fetch(`${BASE_API_URL}/comics/likedOne`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...comics, like: !like }),
        });
        if (response.ok) {
          const updatedComicsFromBack = await response.json();
          toggleLikeComics(updatedComicsFromBack);
        }
      };


  return (
    <div>
      <p></p>
      <div>
        <img src={banner} alt=""  onError={(e) => console.error("Erreur de chargement de l'image", e)}/>
      </div>
      <div>
        <h3>{title}</h3>
      </div>
    </div>
  )
}

export default ComicsItem