import React from "react";
import styles from "./List.module.scss";
import ResultsList from "../ResultsList/ResultsList";

function List({ results, onItemClick }) {
  return (
    <div className={`${styles.mainDiv}`}>
      {results.map((result, idComics) => {
        return (
          <ResultsList
            result={result}
            key={idComics}
            onItemClick={onItemClick}
          />
        );
      })}
    </div>
  );
}

export default List;
