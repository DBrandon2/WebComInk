// import { useEffect, useState } from "react";
// import { useContext } from "react"
// import { ApiContext } from "../context/ApiContext"

// function useFecthData(url, way) {
//     const BASE_API_URL = useContext(ApiContext);

//     useEffect(() => {
//         async function fetchData () {
//             try {
//                 const response = await fetch(`${url}/${way}`);
//                 const imagesComics = await response.json();
//                 console.log(imagesComics)
//                 const imagesUrl = imagesComics.map((image) => {
//                     const uint8Array = new Uint8Array(image.imageBlob.data);
//                     const blob = new Blob([uint8Array]);
//                     const urlImage = URL.createObjectURL(blob);
//                     return urlImage;
//                 });
//                 return imagesUrl
//             } catch (error) {
//                 console.error("Erreur lors de la récupération des images de la catégorie Comics :", error);
//                 throw error;
//             }
//             }
//         fetchData();
//     }, [])
// }

// export default useFecthData