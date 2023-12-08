import React from 'react'
import styles from "./List.module.scss"
import ResultsList from '../ResultsList/ResultsList'

function List({results}) {
  
  return (
    <div className={`${styles.mainDiv}`}>
      {results.map((result, idComics) => {
        return <ResultsList result={result} key={idComics}/>
      })}
      </div>
  )
}

export default List