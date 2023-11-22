import { useEffect, useState } from "react";
import "./Grid.module.scss"

const Grid = () => {

    const [comicsImage, setComicsImage] = useState([]);

    useEffect (() => {
        async function FetchData() {
            try {
              const response =  await fetch("http://localhost:8000/api/comics/getComics")
                const imageComics = await response.json();
                const imagesUrl = imageComics.map((serie) => {
                    const uint8Array = new Uint8Array(serie.banner.data);
                    const blob = new Blob([uint8Array]);
                    const urlImage = URL.createObjectURL(blob);
                    return urlImage  
                })
                setComicsImage(imagesUrl)
            } catch (error) {
                console.error("Erreur lors de la récupération des images dabs la catégorie Comics:", error)
                throw error;
            }
        }
        FetchData();
     }, []) 

  return (
    <div className="grid-container" >
        {comicsImage.map((imageUrl,index) => (
            <div key={index} className="grid-item">
                <img src={imageUrl} alt={`Comics ${index}`} />
            </div>
        ))}
    </div>
  )
}

export default Grid