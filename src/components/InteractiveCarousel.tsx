'use client';

import CarouselCard from '@/components/CarouselCard';
import ExpandedCard from '@/components/ExpandedCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Item {
  id: number;
  img: string;
  text: string;
}

interface InteractiveCarouselProps {
  items: Item[];
}

export default function InteractiveCarousel({
  items: initialItems,
}: InteractiveCarouselProps) {
  const [items, setItems] = useState<Item[]>(initialItems || []);
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  const handleCardClick = useCallback((id: number) => {
    setExpandedItemId(id);
  }, []);

  const handleCloseExpandedCard = useCallback(() => {
    setExpandedItemId(null);
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        carouselRef.current &&
        !carouselRef.current.contains(event.target as Node) &&
        expandedItemId !== null
      ) {
        handleCloseExpandedCard();
      }
    },
    [expandedItemId, handleCloseExpandedCard],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-700">
          Nenhum item para exibir no carrossel.
        </p>
      </div>
    );
  }

  const expandedItem = items.find((item) => item.id === expandedItemId);

  return (
    <div
      className="w-full flex flex-col md:flex-row items-start"
      ref={carouselRef}
    >
      <div
        className={`transition-all duration-500 ease-in-out flex-shrink-0 ${
          expandedItem
            ? 'w-full md:w-1/2 lg:w-2/5 p-4'
            : 'w-0 p-0 overflow-hidden'
        }`}
      >
        {expandedItem && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <ExpandedCard item={expandedItem} />
            <button
              type="button"
              onClick={handleCloseExpandedCard}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Fechar
            </button>
          </div>
        )}
      </div>

      <div
        className={`transition-all duration-500 ease-in-out flex flex-col items-center ${
          expandedItem ? 'w-full md:w-1/2 lg:w-3/5' : 'w-full'
        }`}
      >
        <div className="w-full flex items-center justify-center">
          <div className="relative w-full px-16">
            <Carousel
              opts={{
                align: 'start',
                loop: items.length > 4,
              }}
              className="w-full max-w-none py-4 overflow-visible"
            >
              <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
                {items.map((item, index) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-2 sm:pl-3 md:pl-4 basis-[95%] sm:basis-[80%] md:basis-[60%] lg:basis-[45%] xl:basis-[32%]"
                  >
                    <div className="p-1 h-full">
                      <CarouselCard
                        item={item}
                        isActive={expandedItemId === item.id}
                        onClick={handleCardClick}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-black hover:bg-gray-800 text-white border-black" />
              <CarouselNext className="bg-black hover:bg-gray-800 text-white border-black" />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
