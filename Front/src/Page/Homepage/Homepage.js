import AvantPremière from "./AvantPremière/AvantPremière";
import Book from "./Book/Book";
import FAQ from "./FAQ/FAQ";
import Populaires from "./Populaires/Populaires"
import Carousel from "./Carousel/carousel.component"
import { useEffect, useState } from "react";
import { fetchComicsData } from '../../apis/comics';
import CookieConsent from "react-cookie-consent";


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
      <CookieConsent
        location="bottom"
        buttonText="J'accepte"
        cookieName="myAwesomeCookieName2"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "var(--maintext)", fontSize: "13px", backgroundColor: "var(--accent)" }}
        expires={150}
        overlay
      >
        Ce site utilise des cookies pour une meilleur expérience utilisateur.{" "}
        <span style={{ fontSize: "10px", color: "var(--accent)", marginLeft:"2%" }}>Veuillez accepter pour pouvoir naviguer librement sur le site.</span>
      </CookieConsent>

        <Carousel comicsData={comicsData}/>
        <Populaires comicsData={comicsData} key={idComics}/>
        <AvantPremière comicsData={comicsData} />
        <Book/>
        <FAQ/>
    </div>
  )
}

export default Homepage