import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";

export default function Settings() {
  return (
    <div>
      <div className="flex items-center gap-4 m-4">
        <span className="cursor-pointer text-lg"><IoIosArrowBack /></span>
        <h1>Paramètre utilisateur</h1>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-accent text-xl">Se déconnecter de WebComInk</h2>
        <p className="font-light text-gray-300 mb-4">
          Cliquez sur le bouton suivant, pour vous déconnecter de votre compte
          WebComInk.
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <button className="bg-red-500 text-white w-full py-2 rounded-md md:w-[30%]">
            Se déconnecter
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-accent text-xl">Thème du site</h2>
        <p className="font-light text-gray-300 mb-4">
          Le thème visuel du site que vous souhaitez utiliser.
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <button className="bg-white text-dark-bg w-full py-2 px-4 rounded-md text-start flex justify-between items-center md:w-[30%] ">
            Thème néon <IoIosArrowDown />
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-accent text-xl">Police d'écriture</h2>
        <p className="font-light text-gray-300 mb-4">
        Modifier la police d'écriture du site exclusivement. ( Cela se limite aux menus et interfaces du site et non des chapitres disponibles sur WebComInk).
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <button className="bg-white text-dark-bg w-full py-2 px-4 rounded-md text-start flex justify-between items-center md:w-[30%]">
            Défaut <IoIosArrowDown />
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className=" h-[1px] bg-white w-[90%] md:w-[95%]"></span>
      </div>
      <div className="flex flex-col gap-2 m-8">
        <h2 className="text-red-500 text-xl">Police d'écriture</h2>
        <p className="font-light text-gray-300 mb-4">
        Cliquer sur le bouton suivant pour supprimer votre compte WebComInk.
        </p>
        <p className="text-sm text-red-500 mb-4">
        ATTENTION ! CETTE ACTION EST IRRÉVERSIBLE ET VOTRE COMPTE SERA SUPPRIMÉ DE MANIÈRE PERMANENTE.
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <button className="bg-red-500 text-white w-full py-2 px-4 rounded-md text-start flex justify-between items-center tracking-wide md:w-[30%]">
          <TbAlertTriangleFilled />  Supprimer votre compte <TbAlertTriangleFilled />
          </button>
        </div>
      </div>
    </div>
  );
}
