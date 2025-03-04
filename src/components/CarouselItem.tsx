"use client";

import Image from 'next/image';

interface CarouselItemProps {
  src: string;
  alt: string;
}

export function CarouselItem({ src, alt }: CarouselItemProps) {
  return (
    <div className="carousel-item md:basis-1/2 rounded-xl">
      <Image width="600" height="600" src={src} alt={alt} className="rounded-2xl w-full h-64" />
    </div>
  );
}   