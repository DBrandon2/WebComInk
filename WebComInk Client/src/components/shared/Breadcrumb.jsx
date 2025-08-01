import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <div className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-400 justify-start">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {item.link ? (
                <Link
                  to={item.link}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
