import React from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
export default function TopBarMobile() {
  return (
    <div className="flex justify-between items-center px-6 py-4">
      <MdOutlineArrowBackIos className="text-3xl" />
      <FaMagnifyingGlass className="text-3xl" />
    </div>
  );
}
