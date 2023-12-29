import React, { useEffect, useState } from "react";
import styles from "./ImgChapter.module.scss";
import { useParams } from "react-router-dom";
import { fetchChapterImages } from "../../../apis/comics";

function ImgChapter() {
  const [chapterImages, setChapterImages] = useState([]);
  const { idChapter } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChapterImages(idChapter);

        if (response) {
          setChapterImages(response);
        } else {
          console.error("No chapter images received.");
        }
      } catch (error) {
        console.error("Error fetching chapter images:", error);
      }
    };

    fetchData();
  }, [idChapter]);

  console.log(chapterImages);

  return (
    <div className={`${styles.mainDiv}`}>
      {chapterImages.map((image, index) => (
        <img key={index} src={image.url} alt={`Image ${index}`} />
      ))}
    </div>
  );
}

export default ImgChapter;
