import React from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
export default function TopBarMobile() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 lg:hidden">
      <MdOutlineArrowBackIos className="text-3xl" onClick={handleBack} />
      <FaMagnifyingGlass className="text-3xl" />
    </div>
  );
}
