import React from "react";

export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-10">
      <div className=" w-full h-full flex-1 flex flex-col justify-center items-center">
        <p className=" w-full text-center py-8 text-accent text-2xl font-medium tracking-widest">WebComInk</p>
        <ul className="w-full flex flex-col justify-center items-center gap-4 tracking-wider">
          <li>Mentions Légales</li>
          <li>Politique de protection des données</li>
          <li>Conditions générales d'utilisation</li>
          <li>Politique des cookies</li>
        </ul>
      </div>
      <div className=" w-full h-full flex-1 flex flex-col justify-center items-center">
        <p className=" w-full text-center py-8 text-accent text-2xl font-medium tracking-widest">Liens Utiles</p>
        <ul className="w-full flex flex-col justify-center items-center gap-4 tracking-wider">
          <li>Aide</li>
          <li>Signaler un bug</li>
          <li>Mentions Légales</li>
        </ul>
      </div>
      <div className="w-full h-full flex-1 flex flex-col justify-center items-center">
        <p className=" w-full text-center py-8 text-accent text-2xl font-medium tracking-widest">Nous Contacter</p>
        <ul className="w-full flex flex-col justify-center items-center gap-4 tracking-wider">
          <li>SAV</li>
          <li>Recrutement</li>
          <li>Media</li>
          <li>Partenariats</li>
        </ul>
      </div>
    </div>
  );
}
