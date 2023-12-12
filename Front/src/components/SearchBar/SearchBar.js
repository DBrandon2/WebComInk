import React, { useState } from 'react'
import Bar from './Bar/Bar'
import List from './List/List'
import styles from "./SearchBar.module.scss"

function SearchBar() {
    const [results, setResults] = useState([])
  return (
    <div className={`${styles.mainDiv}`}>
        <div className={`${styles.searchBarDiv}`}>
            <Bar setResults={setResults}/>
            <List results={results}/>
        </div>
    </div>
  )
}

export default SearchBar