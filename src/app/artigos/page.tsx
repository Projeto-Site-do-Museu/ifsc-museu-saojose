'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Artigo {
  id: number;
  titulo: string;
  resumo?: string;
  conteudo?: string;
  imagem?: string;
  dataPublicacao?: string;
}

export default function Artigos() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAtivo, setModalAtivo] = useState<Artigo | null>(null);

  useEffect(() => {
    const fetchArtigos = async () => {
      try {
        const response = await fetch('/api/artigos');
        if (!response.ok) {
          throw new Error('Falha ao buscar artigos');
        }
        const data = await response.json();
        setArtigos(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchArtigos();
  }, []);

  const formatarData = (dataString?: string) => {
    if (!dataString) return 'Data não informada';

    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow p-6 max-w-7xl mx-auto flex justify-center items-center">
          <p className="text-xl text-gray-700">Carregando artigos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow p-6 max-w-7xl mx-auto flex justify-center items-center">
          <p className="text-xl text-red-500">Erro: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Artigos do Museu de São José
        </h1>

        {artigos.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Nenhum artigo encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artigos.map((artigo) => (
              <button
                key={artigo.id}
                type="button"
                className="cursor-pointer group text-left block w-full"
                onClick={() => setModalAtivo(artigo)}
              >
                <div className="relative overflow-hidden shadow-md">
                  <Image
                    src={artigo.imagem || '/imgs/placeholder.jpg'}
                    alt={artigo.titulo}
                    width={400}
                    height={250}
                    className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  <h2 className="font-semibold text-lg text-gray-900">
                    {artigo.titulo}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {artigo.resumo || 'Sem descrição disponível'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatarData(artigo.dataPublicacao)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {modalAtivo && (
          <dialog
            open
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 w-full h-full"
            onClick={() => setModalAtivo(null)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setModalAtivo(null);
              }
            }}
          >
            <div
              role="document"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalAtivo.titulo}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {formatarData(modalAtivo.dataPublicacao)}
                </p>
              </div>
              <Image
                src={modalAtivo.imagem || '/imgs/placeholder.jpg'}
                alt={modalAtivo.titulo}
                width={800}
                height={500}
                className="w-full h-auto mb-4 rounded-md"
              />
              <div className="text-gray-700 text-base">
                <p>
                  {modalAtivo.resumo ||
                    modalAtivo.conteudo?.replace(/<[^>]*>/g, '') ||
                    'Conteúdo não disponível'}
                </p>
              </div>
              <div className="text-right mt-4">
                <button
                  type="button"
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
