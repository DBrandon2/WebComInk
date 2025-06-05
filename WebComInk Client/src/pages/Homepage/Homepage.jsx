import React from "react";
import Carousel from "../../components/Carousel";
import LatestRelease from "./LatestRelease";

export default function Homepage() {
  return (
    <div className="w-full h-full flex flex-col gap-12">
      <Carousel />
      <LatestRelease />
    </div>
  );
}
