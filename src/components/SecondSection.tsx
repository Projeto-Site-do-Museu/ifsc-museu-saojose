"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';

export default function SecondSection() {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!api) return;

    setTotalSlides(api.scrollSnapList().length);

    const updateCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    updateCurrentIndex();

    api.on("select", updateCurrentIndex);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [api]);

  return (
    <div className="relative min-h-[500px]">
      <div className="max-w-[1200px] h-[600px] mx-auto bg-cover bg-center bg-[url('/imgs/bg2.png')]">
        <div className="flex justify-center items-center pt-16">
          <h2 className="text-3xl font-michroma text-white text-center py-[5vh]">Nossos itens</h2>
        </div>

        <div className="mt-8 relative max-w-[90%] mx-auto">
          <Carousel setApi={setApi} className="md:pt-[10vh]">
            <CarouselContent className="flex">
              <CarouselItem className="carousel-item md:basis-1/2 rounded-xl">
                <Image width="600" height="600" src="/imgs/card1.png" alt="Card 1" className="rounded-2xl w-full h-64" />
              </CarouselItem>
              <CarouselItem className="carousel-item md:basis-1/2">
                <Image width="600" height="600" src="/imgs/img3.jpg" alt="Card 2" className="rounded-2xl w-full h-64" />
              </CarouselItem>
              <CarouselItem className="carousel-item md:basis-1/2">
                <Image width="600" height="600" src="/imgs/img5.jpg" alt="Card 3" className="rounded-2xl w-full h-64" />
              </CarouselItem>
              <CarouselItem className="carousel-item md:basis-1/2">
                <Image width="600" height="600" src="/imgs/img8.jpg" alt="Card 4" className="rounded-2xl w-full h-64" />
              </CarouselItem>
              <CarouselItem className="carousel-item md:basis-1/2">
                <Image width="600" height="600" src="/imgs/img13.jpg" alt="Card 5" className="rounded-2xl w-full h-64" />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        <div className="flex justify-center items-center mt-4 space-x-2 relative">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div key={index} className="relative flex items-center">
              <div
                className={`w-4 h-4 rounded-full ml-2 ${currentIndex === index ? "bg-white" : "bg-transparent border-2 border-white"}`}
              ></div>

              {(currentIndex + 1 === index && currentIndex !== 4) && (
                <div className="absolute left-[-7px] top-1/2 transform -translate-y-1/2 h-[2px] bg-white animate-slide-in"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}