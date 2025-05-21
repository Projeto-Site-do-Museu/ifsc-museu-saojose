'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const images = [
  {
    src: '/imgs/img1.jpg',
    alt: 'Imagem 1',
    descricao: 'Esta é a descrição da imagem 1. Um item importante do nosso acervo.',
  },
  {
    src: '/imgs/img2.jpg',
    alt: 'Imagem 2',
    descricao: 'Descrição da imagem 2, explicando seu contexto e importância histórica.',
  },
  {
    src: '/imgs/img3.jpg',
    alt: 'Imagem 3',
    descricao: 'Detalhes sobre a imagem 3, parte fundamental da exposição atual.',
  },
  {
    src: '/imgs/img4.jpg',
    alt: 'Imagem 4',
    descricao: 'Informações sobre a imagem 4 e sua relevância para o museu.',
  },
  {
    src: '/imgs/img5.jpg',
    alt: 'Imagem 5',
    descricao: 'A imagem 5 representa um momento marcante da história local.',
  },
];

export default function Galeria() {
  const [modalImage, setModalImage] = useState<null | typeof images[0]>(null);

  const closeModal = () => setModalImage(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <h1 className="text-3xl font-bold text-center text-primary mb-8">
            Acervo do Museu
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {images.map((item) => (
              <button
                key={item.src}
                onClick={() => setModalImage(item)}
                className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={300}
                  height={200}
                  className="object-contain w-full md:w-[300px] h-[200px] bg-gray-100"
                />
                <div className="p-4 flex items-center text-gray-800 text-left">
                  <p className="text-base">{item.descricao}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal */}
        {modalImage && (
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-lg max-w-4xl w-full flex flex-col md:flex-row gap-6"
            >
              <div className="flex justify-center items-center">
                <Image
                  src={modalImage.src}
                  alt={modalImage.alt}
                  width={600}
                  height={400}
                  className="object-contain max-h-[80vh]"
                />
              </div>
              <div className="flex items-center text-gray-800">
                <p className="text-lg">{modalImage.descricao}</p>
              </div>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-3xl font-bold"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}



