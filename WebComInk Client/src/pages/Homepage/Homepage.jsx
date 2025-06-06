import React from "react";
import Carousel from "../../components/carousel";
import LatestRelease from "./LatestRelease";
import MostPopular from "./MostPopular";
import Discover from "./Discover";

export default function Homepage() {
  return (
    <div className="w-full h-full flex flex-col gap-16">
      <Carousel />
      <LatestRelease />
      <MostPopular />
      <Discover />
    </div>
  );
}
