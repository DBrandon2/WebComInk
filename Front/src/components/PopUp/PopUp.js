import React from "react";
import styles from "./PopUp.module.scss";

const PopUp = ({message, message2, onConfirm, onCancel, active }) => {

  return (
    <div className={`${styles.overlay} ${active ? styles.active : ""}`}>
      <div className={`${styles.modal} ${active ? styles.active : ""}`}>
        <p>{message}</p>
        <p className={`${styles.span}`}>{message2}</p>
        <button className={`whiteButton ${styles.btn}`} onClick={onConfirm}>Oui</button>
        <button className={`whiteButton ${styles.btn}`} onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
};

export default PopUp;