'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Item {
  id: number;
  img: string;
  text: string;
}

export default function GallerySection() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Falha ao buscar itens da galeria');
        }
        const data = await response.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="w-full overflow-y-auto no-scrollbar h-[75vh] p-4 flex justify-center items-center">
        <p className="text-xl text-gray-700">Carregando galeria...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-y-auto no-scrollbar h-[75vh] p-4 flex justify-center items-center">
        <p className="text-xl text-red-500">Erro: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-y-auto no-scrollbar h-[75vh] p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg shadow-lg overflow-hidden"
            >
              <Image
                src={item.img}
                alt={`Imagem do artigo ${item.id}`}
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="text-secondary-foreground text-center">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
