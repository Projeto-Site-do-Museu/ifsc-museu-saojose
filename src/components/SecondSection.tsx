'use client';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SecondSection() {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  useEffect(() => {
    if (!api) return;

    setTotalSlides(api.scrollSnapList().length);

    const updateCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    updateCurrentIndex();
    api.on('select', updateCurrentIndex);
  }, [api]);

  const handlePrev = () => {
    if (api) api.scrollPrev();
  };

  const handleNext = () => {
    if (api) api.scrollNext();
  };

  return (
    <div className="relative min-h-full bg-black py-10">
      <div className="max-w-[1200px] w-full px-4 mx-auto flex flex-col justify-center items-center">
        <h2 className="text-3xl md:text-3xl font-worksans text-primary-foreground text-center mb-8 md:mb-10">
          Artefatos Históricos
        </h2>

        {/* Carousel */}
        <div className="relative w-full">
          <Carousel setApi={setApi} className="w-full overflow-hidden">
            <CarouselContent className="flex transition-transform ease-in-out">
              {[
                '/imgs/img4.jpg',
                '/imgs/img2.jpg',
                '/imgs/img6.jpg',
                '/imgs/card1.png',
                '/imgs/img8.jpg',
                '/imgs/img24.JPG',
              ].map((src, index) => (
                <CarouselItem
                  key={`slide-image-${src}`}
                  className="w-full md:w-1/2 flex justify-center items-center px-2" // 1 imagem no mobile, 2 no desktop
                >
                  <Image
                    width={1920}
                    height={1080}
                    src={src}
                    alt={`Card ${index + 1}`}
                    className="rounded-xl object-cover w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Botões de navegação */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Anterior"
            className="absolute top-1/2 left-2 md:left-[-50px] transform -translate-y-1/2 bg-primary-foreground text-black rounded-full p-2 md:p-3 shadow-md hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Próximo"
            className="absolute top-1/2 right-2 md:right-[-50px] transform -translate-y-1/2 bg-primary-foreground text-black rounded-full p-2 md:p-3 shadow-md hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-white"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicadores de página */}
        <div className="flex justify-center items-center mt-6 space-x-2 md:space-x-3">
          {Array.from({ length: totalSlides }).map((_, index) => {
            // Create a unique ID based on position
            const slideId = `slide-${index + 1}-of-${totalSlides}`;
            return (
              <button
                type="button"
                key={slideId}
                aria-label={`Selecionar slide ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full transition-all ${
                  currentIndex === index
                    ? 'bg-white'
                    : 'bg-transparent border-2 border-white'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
