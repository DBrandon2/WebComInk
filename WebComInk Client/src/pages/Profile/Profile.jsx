import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Profile() {
  return (
    <div className="flex flex-col w-full">
      <ul className="flex p-6">
        <li className="mr-3">
          <NavLink end to="">
            Overview
          </NavLink>
        </li>
        <li className="mr-3">
          <NavLink to="data">Data</NavLink>
        </li>
      </ul>
      <div className="p-6">
        <h2 className="mb-4 text-2xl text-blue-700 text-center">
          Page de profil
        </h2>
        <Outlet />
      </div>
    </div>
  );
}
