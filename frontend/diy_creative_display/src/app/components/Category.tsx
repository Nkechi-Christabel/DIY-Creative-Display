import React, { useRef, useState } from "react";
import { categories } from "../post/create/page";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";

type Iprops = {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
};

export const Category = ({ selectedCategory, setSelectedCategory }: Iprops) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 100;
    }
  };
  return (
    <div className="pt-6 pb-4">
      <div className="flex items-center justify-center">
        <IoChevronBackSharp className="cursor-pointer" onClick={scrollLeft} />
        <ul
          className="flex justify-between max-w-2xl overflow-x-scroll no-scrollbar"
          ref={containerRef}
        >
          <li
            key="DIY"
            className={`cursor-pointer text-nowrap py-2 px-3 rounded-3xl hover:text-gray-500 ${
              selectedCategory === "DIYs" ? "bg-gray-100" : ""
            }`}
            onClick={() => setSelectedCategory("DIYs")}
          >
            DIYs
          </li>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`font-bold cursor-pointer text-nowrap py-2 px-3 rounded-3xl hover:text-gray-500 ${
                selectedCategory === category.name ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </li>
          ))}
        </ul>
        <IoChevronForwardSharp
          className="cursor-pointer"
          onClick={scrollRight}
        />
      </div>
    </div>
  );
};