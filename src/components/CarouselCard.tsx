'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CarouselCardProps {
  item: {
    id: number;
    img: string;
    text: string;
  };
  isActive: boolean;
  onClick: (id: number) => void;
}

export default function CarouselCard({
  item,
  isActive,
  onClick,
}: CarouselCardProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [item.id, item.img, isActive]);

  const handleImageError = () => {
    console.error(`[CarouselCard] IMAGE LOAD FAILED for: ${item.img} (item id: ${item.id})`);
    setImageError(true);
  };

  return (
    <div className="h-full w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md group relative cursor-pointer" onClick={() => onClick(item.id)}>
      {imageError ? (
        <div className="w-full h-full bg-gray-300 flex flex-col items-center justify-center text-center p-3">
          <p className="text-gray-600 font-semibold">Imagem indisponível</p>
          <p className="text-gray-500 text-xs mt-1">{item.img}</p>
        </div>
      ) : (
        <Image
          src={item.img}
          alt={item.text || `Imagem ${item.id}`}
          fill 
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
          onError={handleImageError}
          priority={item.id <= 2} 
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" 
        />
      )}

      {!imageError && (
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <h3 className="text-white text-sm sm:text-base font-semibold leading-tight 
                         group-hover:underline decoration-white/70 underline-offset-2 
                         line-clamp-2 sm:line-clamp-3">
            {item.text}
          </h3>
        </div>
      )}
      
      {!isActive && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>}
    </div>
  );
}
