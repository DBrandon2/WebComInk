import styles from "./Book.module.scss";

function Book() {
  return (
    <div className={`${styles.mainDiv}`}>
      <div className={`${styles.book1}`}>
        <h4>Lisez vos mangas préféré sur n'importe quels platforme !</h4>
        <p>
          Sur WebComInk, lisez les derniers chapitres de vos œuvres favorite en
          simulcast 1 heure seulement après leurs parutions au Japon.
        </p>
        <span>
          Et avec l'application mobile, emportez vos mangas partout avec vous !
        </span>
      </div>
      <div className={`${styles.book2}`}>
        <h4>Les exclusivité WebComInk</h4>
        <p>
          Découvrez de nouvelles pépites avec nos nouveaux artistes émergeant.
          Un nouveau vent de fraîcheur disponible seulement sur WebComInk.
        </p>
      </div>
    </div>
  );
}

export default Book;
