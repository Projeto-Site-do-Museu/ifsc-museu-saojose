'use client';

import CarouselCard from '@/components/CarouselCard';
import ExpandedCard from '@/components/ExpandedCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Item {
  id: number;
  img: string;
  text: string;
}

const items: Item[] = [
  {
    id: 1,
    img: '/imgs/card1.png',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.',
  },
  {
    id: 2,
    img: '/imgs/img3.jpg',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.',
  },
  {
    id: 3,
    img: '/imgs/img5.jpg',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.',
  },
  {
    id: 4,
    img: '/imgs/img13.jpg',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.',
  },
  {
    id: 5,
    img: '/imgs/img18.jpg',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, diam in condimentum consectetur, nibh tortor facilisis massa, in convallis velit enim nec enim.',
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
    [activeItem],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="w-full flex flex-col md:flex-row" ref={carouselRef}>
      <div
        className={`flex-shrink-0 ${
          activeItem !== null
            ? 'w-full md:w-[1000px] px-4 md:px-10'
            : 'w-0 px-0'
        }`}
      >
        {activeItem !== null &&
          items.find((item) => item.id === activeItem) && (
            <ExpandedCard
              item={items.find((item) => item.id === activeItem) || items[0]}
            />
          )}
      </div>

      <div
        className={`${activeItem === null ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
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

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <a href="/acervo/acervoCompleto">
            <button
              type="button"
              className="bg-destructive text-white px-10 py-4 rounded-2xl text-xl md:text-2xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Ver acervo completo
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
