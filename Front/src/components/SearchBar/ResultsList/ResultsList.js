import React from 'react'
import styles from "./ResultsList.module.scss"
import { NavLink } from 'react-router-dom'

function ResultsList({result, onItemClick}) {

  const handleItemClick = (e) => {
    e.stopPropagation();// Appeler la fonction onClick fournie par le parent (SearchBar) pour fermer la liste
    onItemClick();
  };
  return (
    <div className={`${styles.mainDiv}`} onClick={handleItemClick}>
    <NavLink to={`../details/${result.idComics}`}>
        <img className={`${styles.imgPreview}`} src={`http://localhost:8000/${result?.portrait}`} alt="" />
        {result.title}
    </NavLink>
    </div>
  )
}

export default ResultsList