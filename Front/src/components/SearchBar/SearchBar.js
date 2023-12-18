import React, { useEffect, useRef, useState } from 'react'
import Bar from './Bar/Bar'
import List from './List/List'
import styles from "./SearchBar.module.scss"

function SearchBar() {
    const [results, setResults] = useState([]);
    const [isListVisible, setListVisibility] = useState(false);
    const searchBarRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
          // Clic en dehors de la barre de recherche
          setListVisibility(false);
        }
      };
  
      document.addEventListener('click', handleClickOutside);
  
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [searchBarRef]);
  
    const handleBarClick = () => {
      setListVisibility(true);
    };

    const handleItemClick = () => {
      setListVisibility(false);
    };

  return (
    <div className={`${styles.mainDiv}`}>
        <div className={`${styles.searchBarDiv}`} ref={searchBarRef} onClick={handleBarClick}>
            <Bar setResults={setResults}/>
            {isListVisible && <List results={results} onItemClick={handleItemClick} />}
        </div>
    </div>
  )
}

export default SearchBar