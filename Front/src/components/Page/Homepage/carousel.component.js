import React from "react";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import image1 from "../../../assets/images/Banner-chainsawman.png";
import image2 from "../../../assets/images/Banner-Frieren2.jpg";
import image3 from "../../../assets/images/Banner-SpyXFamily.png";
import "./carousel.component.module.scss"


export default function CarouselComponent() {
    const myImageStyle = {}
    return (
        <div className="carousel-wrapper slider-container">
        <Carousel infiniteLoop autoPlay showStatus={false} showThumbs={false} >
            <div>
                <img src={image1} />
            </div>
            <div>
                <img src={image2} /> 
            </div>
            <div>
                <img src={image3} />
            </div>
        </Carousel>
    </div>
    );
}