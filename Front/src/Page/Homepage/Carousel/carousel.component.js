import React from "react";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./carousel.component.module.scss"


export default function CarouselComponent({comicsData}) {
    return (
        <div className="carousel-wrapper slider-container">
        <Carousel infiniteLoop autoPlay showStatus={false} showThumbs={false} >
           {comicsData && <div>
            <img src={`http://localhost:8000/${comicsData[6]?.banner}`} alt="ChainsawMan" />
            </div>}
            {comicsData && <div>
            <img src={`http://localhost:8000/${comicsData[7]?.banner}`} alt="ChainsawMan" />
            </div>}
            {comicsData && <div>
            <img src={`http://localhost:8000/${comicsData[8]?.banner}`} alt="ChainsawMan" />
            </div>}
        </Carousel>
    </div>
    );
}