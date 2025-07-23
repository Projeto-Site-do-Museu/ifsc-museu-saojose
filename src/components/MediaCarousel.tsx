'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Media {
  id: number;
  tipo: 'imagem' | 'iframe';
  url: string;
  titulo?: string;
  ordem?: number;
}

interface MediaCarouselProps {
  medias: Media[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function MediaCarousel({
  medias,
  isOpen,
  onClose,
  initialIndex = 0,
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || medias.length === 0) {
    return null;
  }

  const currentMedia = medias[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? medias.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === medias.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <dialog
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center border-none p-0 max-w-none max-h-none"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      open
    >
      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
        {/* Botão fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Navegação anterior */}
        {medias.length > 1 && (
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Navegação próxima */}
        {medias.length > 1 && (
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Conteúdo da mídia */}
        <div className="w-full h-full flex items-center justify-center">
          {currentMedia.tipo === 'imagem' ? (
            <Image
              src={currentMedia.url}
              alt={currentMedia.titulo || 'Imagem do acervo'}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
              unoptimized
            />
          ) : (
            <iframe
              src={currentMedia.url}
              title={currentMedia.titulo || 'Iframe do acervo'}
              className="w-full h-full max-w-4xl max-h-3xl"
              frameBorder="0"
              allowFullScreen
            />
          )}
        </div>

        {/* Indicadores */}
        {medias.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {medias.map((media, index) => (
              <button
                key={`indicator-${media.id || index}`}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Contador */}
        {medias.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
            {currentIndex + 1} / {medias.length}
          </div>
        )}
      </div>
    </dialog>
  );
}
