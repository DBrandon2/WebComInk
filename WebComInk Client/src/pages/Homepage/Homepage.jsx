import React from "react";
import Carousel from "../../components/Carousel";
import LatestRelease from "./LatestRelease";
import MostPopular from "./MostPopular";
import Discover from "./Discover";

export default function Homepage() {
  return (
    <div className="w-full h-full flex flex-col gap-18 lg:gap-32 mb-32">
      <Carousel />
      <LatestRelease />
      <MostPopular />
      <Discover />
    </div>
  );
}
