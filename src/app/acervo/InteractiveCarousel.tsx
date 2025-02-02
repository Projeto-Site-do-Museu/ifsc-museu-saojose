"use client";

import { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const items = [
  { id: 1, img: "/imgs/card1.png", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim. " },
  { id: 2, img: "/imgs/card2.png", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim. " },
  { id: 3, img: "/imgs/card3.png", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim. " },
  { id: 4, img: "/imgs/card4.png", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim. " },
  { id: 5, img: "/imgs/card5.png", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim. " }
];

export default function InteractiveCarousel() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [unactiveItems, setUnactiveItems] = useState<number[]>(items.map(item => item.id));
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleClick = (id: number) => {
    if (activeItem === id) {
      setUnactiveItems(prev => [...prev, activeItem]);
      setActiveItem(null);
    } else {
      setActiveItem(id);
      setUnactiveItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      carouselRef.current &&
      !carouselRef.current.contains(event.target as Node) &&
      activeItem !== null
    ) {
      setUnactiveItems(prev => [...prev, activeItem]);
      setActiveItem(null);
    }
  };

  useEffect(() => {
    if (activeItem !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeItem]);

  return (
      <div className="w-full flex flex-column" ref={carouselRef}>
      <div className={`flex-shrink-0 px-10 ${activeItem !== null ? "w-[1000px]" : "w-0 px-0"}`}>
          {activeItem !== null && (
            <div className="flex flex-row transition-all duration-300 rounded-xl">
              <img
                src={items.find((item) => item.id === activeItem)?.img}
                alt={`Card ${activeItem}`}
                className="w-[400px] h-[400px] object-cover rounded-2xl"
              />
                <p className={` pl-5 text-2xl font-bold text-white transition-opacity duration-300` }>
                     {items.find((item) => item.id === activeItem)?.text}
                </p>
            </div>
            
          )}
        </div>
        <div className={`${activeItem === null ? "w-full opacity-100" : "w-0 opacity-0"}`}>
        <Carousel
          opts={{
            dragFree: activeItem !== null, // Desabilita o scroll quando um item está ativo
          }}
        >
          <CarouselContent>
            {items.map((item) => (
              <div className="px-10">
                <CarouselItem>
                  <div
                    className={`rounded-xl overflow-hidden cursor-pointer ${
                        activeItem !== null ? "w-[0px] h-[0px] opacity-0" : "w-[300px] h-[300px]"
                    }`}
                    onClick={() => handleClick(item.id)}
                  >
                    <img src={item.img} alt={`Card ${item.id}`} className="w-full h-full object-cover" />
                    
                  </div>
                </CarouselItem>
              </div>
                
              
            ))}
          </CarouselContent>
        </Carousel>
        <div className="m-auto w-full flex justify-center pt-10">
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