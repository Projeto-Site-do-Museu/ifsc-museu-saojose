'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const artigos = [
  {
    src: '/imgs/img1.jpg',
    alt: 'Imagem 1',
    titulo: 'Título da obra 1',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    data: '5 de maio de 2005',
    tags: [],
  },
  {
    src: '/imgs/img2.jpg',
    alt: 'Imagem 2',
    titulo: 'Titulo da obra 2',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    data: '24 de setembro de 2010',
    tags: [],
  },
  {
    src: '/imgs/img3.jpg',
    alt: 'Imagem 3',
    titulo: 'Titulo da obra 3',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    data: '5 de outubro de 2014',
    tags: [],
  },
  {
    src: '/imgs/img4.jpg',
    alt: 'Imagem 3',
    titulo: 'Titulo da obra 4',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    data: '19 de agosto de 2007',
    tags: [],
  },
  {
    src: '/imgs/img5.jpg',
    alt: 'Imagem 3',
    titulo: 'Titulo da obra 5',
    descricao:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    data: '12 de junho de 1990',
    tags: [],
  },
];

export default function Artigos() {
  const [modalAtivo, setModalAtivo] = useState<null | typeof artigos[0]>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Artigos do Museu de São José
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artigos.map((artigo) => (
            <div
              key={artigo.src}
              className="cursor-pointer group"
              onClick={() => setModalAtivo(artigo)}
            >
              <div className="relative overflow-hidden shadow-md">
                <Image
                  src={artigo.src}
                  alt={artigo.alt}
                  width={400}
                  height={250}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {artigo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <h2 className="font-semibold text-lg text-gray-900">
                  {artigo.titulo}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {artigo.descricao}
                </p>
                <p className="text-xs text-gray-400 mt-1">{artigo.data}</p>
              </div>
            </div>
          ))}
        </div>

        {modalAtivo && (
          <dialog
            open
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-full h-full"
            onClick={() => setModalAtivo(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]"
            >
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {modalAtivo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-black text-white text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalAtivo.titulo}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{modalAtivo.data}</p>
              </div>
              <Image
                src={modalAtivo.src}
                alt={modalAtivo.alt}
                width={800}
                height={500}
                className="w-full h-auto mb-4 rounded-md"
              />
              <p className="text-gray-700 text-base whitespace-pre-wrap">
                {modalAtivo.descricao}
              </p>
              <div className="text-right mt-4">
                <button
                  onClick={() => setModalAtivo(null)}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Fechar
                </button>
              </div>
            </div>
          </dialog>
        )}
      </main>

      <Footer />
    </div>
  );
}





