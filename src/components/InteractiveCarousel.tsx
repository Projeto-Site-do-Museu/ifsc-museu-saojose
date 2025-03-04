"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselCard from "@/components/CarouselCard";
import ExpandedCard from "@/components/ExpandedCard";

interface Item {
  id: number;
  img: string;
  text: string;
}

const items: Item[] = [
  {
    id: 1,
    img: "/imgs/card1.png",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.",
  },
  {
    id: 2,
    img: "/imgs/img3.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.",
  },
  {
    id: 3,
    img: "/imgs/img5.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.",
  },
  {
    id: 4,
    img: "/imgs/img13.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.",
  },
  {
    id: 5,
    img: "/imgs/img18.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.",
  },
];

export default function InteractiveCarousel() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleClick = (id: number) => {
    setActiveItem(activeItem === id ? null : id);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        carouselRef.current &&
        !carouselRef.current.contains(event.target as Node) &&
        activeItem !== null
      ) {
        setActiveItem(null);
      }
    },
    [activeItem]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="w-full flex flex-col md:flex-row" ref={carouselRef}>
      <div
        className={`flex-shrink-0 ${
          activeItem !== null
            ? "w-full md:w-[1000px] px-4 md:px-10"
            : "w-0 px-0"
        }`}
      >
        {activeItem !== null && (
          <ExpandedCard item={items.find((item) => item.id === activeItem)!} />
        )}
      </div>

      <div
        className={`${
          activeItem === null ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      >
        <Carousel
          opts={{
            dragFree: activeItem !== null,
          }}
        >
          <CarouselContent>
            {items.map((item) => (
              <CarouselItem key={item.id}>
                <CarouselCard
                  item={item}
                  isActive={activeItem !== null}
                  onClick={handleClick}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="m-auto w-full flex justify-center md:pt-10">
          <a href="/acervo/acervoCompleto">
            <button className="bg-purple-600 text-white px-12 py-6 rounded-xl text-2xl font-semibold hover:bg-purple-700 transition duration-300">
              Ver acervo completo
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}