'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const images = [
  {
    src: '/imgs/img1.jpg',
    alt: 'Imagem 1',
    descricao: 'Descrição da imagem 1',
  },
  {
    src: '/imgs/img2.jpg',
    alt: 'Imagem 2',
    descricao: 'Descrição da imagem 2',
  },
  {
    src: '/imgs/img3.jpg',
    alt: 'Imagem 3',
    descricao: 'Descrição da imagem 3',
  },
  {
    src: '/imgs/img4.jpg',
    alt: 'Imagem 4',
    descricao: 'Descrição da imagem 4',
  },
  {
    src: '/imgs/img5.jpg',
    alt: 'Imagem 5',
    descricao: 'Descrição da imagem 5',
  },
];

export default function Galeria() {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow bg-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          {/* Imagem principal */}
          <div className="mb-2 border rounded-xl bg-black flex items-center justify-center h-[550px]">
            <Image
              src={selected.src}
              alt={selected.alt}
              width={800}
              height={500}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="text-center text-gray-800 text-lg font-medium mb-6">
            {selected.descricao}
          </div>

          {/* Miniaturas */}
          <div className="flex gap-4 justify-center flex-wrap pb-2">
            {images.map((img) => (
              <button
                key={img.src}
                onClick={() => setSelected(img)}
                className={`border-2 rounded-md overflow-hidden hover:scale-105 transition-transform ${
                  selected.src === img.src
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={100}
                  height={80}
                  className="object-contain w-24 h-16 bg-white"
                />
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

