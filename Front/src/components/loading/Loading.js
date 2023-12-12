import React from 'react'
import styles from "./Loading.module.scss"

function Loading() {
  return (
    <div>
        <i className={`fas fa-spinner ${styles.spinner}`}></i>
    </div>
  )
}

export default Loading