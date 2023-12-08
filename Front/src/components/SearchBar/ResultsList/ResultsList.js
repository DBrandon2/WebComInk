import React from 'react'
import styles from "./ResultsList.module.scss"

function ResultsList({ result}) {
  return (
    <div 
    // onClick={}
    className={`${styles.mainDiv}`}>
        {result.title}
    </div>
  )
}

export default ResultsList