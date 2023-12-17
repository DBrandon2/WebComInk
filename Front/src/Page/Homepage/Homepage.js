import AvantPremière from "./AvantPremière/AvantPremière";
import Book from "./Book/Book";
import FAQ from "./FAQ/FAQ";
import Populaires from "./Populaires/Populaires"
import Carousel from "./Carousel/carousel.component"
import { useEffect, useState } from "react";
import { fetchComicsData } from '../../apis/comics';


function Homepage() {
  const [comicsData, setComicsData] = useState([]);
  const idComics = comicsData.length > 0 ? comicsData[0].idComics : null;

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchComicsData();
            if (data) {
                setComicsData(data);
                console.log(data);
            }
        };
        fetchData();
    }, []);
  
  return (
    <div>
        <Carousel comicsData={comicsData}/>
        <Populaires comicsData={comicsData} key={idComics}/>
        <AvantPremière comicsData={comicsData} />
        <Book/>
        <FAQ/>
    </div>
  )
}

export default Homepage