import React from "react";
import Carousel from "../../components/carousel";
import ButtonAnimated from "../../components/ButtonAnimated";

export default function Homepage() {
  return (
    <div className="w-full h-full flex flex-col">
      <Carousel />
      <ButtonAnimated />
    </div>
  );
}
