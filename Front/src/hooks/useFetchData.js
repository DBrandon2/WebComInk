// import { useEffect, useState } from "react";
// import { useContext } from "react"
// import { ApiContext } from "../context/ApiContext"

// export function useFetchData(url, way) {
//     const BASE_API_URL = useContext(ApiContext);

//     const [datas, setDatas] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

    
//     useEffect(() => {
//         async function fetchDatas() {
//             try {
//                 const response = await fetch(`${url}/${way}`);
//                 if (response.ok) {
//               const datasBack = await response.json();
//               // console.log(datasBack);
//               const modifiedDatasBack = datasBack.map((c) =>
//                 c.like === 1 ? { ...c, like: true } : { ...c, like: false }
//               );
//               const newModifiedDatas = await Promise.all(
//                 modifiedDatasBack.map(async (c) => {
//                   if (c.banner === null) {
//                     const response = await fetch(
//                       URL.createObjectURL(
//                         new Blob([new Uint8Array(c.imgBlob.data)])
//                       )
//                     );
//                     const text = await response.text();
//                     c.banner = text;
//                   }
//                   return { ...c };
//                 })
//               );
//               console.log(newModifiedDatas);
//               setDatas(newModifiedDatas);
//             }
//           } catch (error) {
//             console.error(error);
//           } finally {
//             setIsLoading(false);
//         }
//         }
//         fetchDatas();
//     }, [url, way]);
//     return [[datas, setDatas], isLoading];


    // useEffect(() => {
    //     async function fetchData () {
    //         try {
    //             const response = await fetch(`${url}/${way}`);
    //             const imagesComics = await response.json();
    //             console.log(imagesComics)
    //             const imagesUrl = imagesComics.map((image) => {
    //                 const uint8Array = new Uint8Array(image.imageBlob.data);
    //                 const blob = new Blob([uint8Array]);
    //                 const urlImage = URL.createObjectURL(blob);
    //                 return urlImage;
    //             });
    //             return imagesUrl
    //         } catch (error) {
    //             console.error("Erreur lors de la récupération des images de la catégorie Comics :", error);
    //             throw error;
    //         }
    //         }
    //     fetchData();
    // }, [])
// }
