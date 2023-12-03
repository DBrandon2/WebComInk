import React from "react";
import styles from "./PopUp.module.scss";

const PopUp = ({message, onConfirm, onCancel, active }) => {

  return (
    <div className={`${styles.overlay} ${active ? styles.active : ""}`}>
      <div className={`${styles.modal} ${active ? styles.active : ""}`}>
        <p>{message}</p>
        <button className={`whiteButton ${styles.btn}`} onClick={onConfirm}>Oui</button>
        <button className={`whiteButton ${styles.btn}`} onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
};

export default PopUp;