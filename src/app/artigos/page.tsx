'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ImageItem {
  src: string;
  alt: string;
  descricao: string;
}

export default function Galeria() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [modalImage, setModalImage] = useState<null | ImageItem>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/artigos');
        if (!response.ok) {
          throw new Error('Falha ao buscar imagens');
        }
        const data = await response.json();
        setImages(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const closeModal = () => setModalImage(null);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow bg-white py-10 px-4 flex justify-center items-center">
          <p className="text-xl text-gray-700">Carregando artigos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow bg-white py-10 px-4 flex justify-center items-center">
          <p className="text-xl text-red-500">Erro: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <h1 className="text-3xl font-bold text-center text-primary mb-8">
            Artigos do Museu
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {images.map((item) => (
              <button
                type="button"
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

        {modalImage && (
          <dialog
            open
            aria-modal="true"
            onClick={closeModal}
            onKeyDown={(e) => e.key === 'Escape' && closeModal()}
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 m-0 p-0 w-full h-full border-none"
          >
            <div
              role="document"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
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
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-3xl font-bold"
              >
                &times;
              </button>
            </div>
          </dialog>
        )}
      </main>

      <Footer />
    </div>
  );
}
