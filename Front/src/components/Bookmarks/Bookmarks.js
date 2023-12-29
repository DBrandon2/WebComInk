import React, { useEffect, useRef, useState } from "react";
import { addBook, fetchBooksUser, removeBook } from "../../apis/bookmarks";
import "./Bookmarks.scss";

function Bookmarks({ idComics, iduser }) {
  const [bookCount, setBookCount] = useState(0);
  const [isBooked, setIsBooked] = useState(false);
  const [isUnbooked, setIsUnbooked] = useState(false);

  const bookmarkRef = useRef();

  useEffect(() => {
    fetchBooksUser(idComics, iduser)
      .then((data) => {
        setBookCount(data.bookCount);
        setIsBooked(data.isBooked);
      })
      .catch((error) => console.error("Error fetching bookmarks:", error));
  }, [idComics, iduser]);

  const handleBookmarks = async () => {
    try {
      if (isBooked) {
        await removeBook(idComics, iduser);
        setIsBooked(false);
      } else {
        await addBook(idComics, iduser);
        setIsBooked(true);
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du like :", error);
    }
  };

  return (
    <div
      className={`mainDiv ${isBooked ? "booked" : ""} ${
        !isBooked ? "unbooked" : ""
      }`}
      onClick={handleBookmarks}
    >
      <i
        className={`fa-solid fa-bookmark heart ${!isBooked ? "gray" : ""}`}
      ></i>
    </div>
  );
}

export default Bookmarks;
