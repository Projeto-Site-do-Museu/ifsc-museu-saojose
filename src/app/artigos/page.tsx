'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ItemEditor from '@/components/ItemEditor';
import { useAdmin } from '@/contexts/AdminContext';
import { Edit, Plus, Trash2, FileText } from 'lucide-react';
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
  const [editorAtivo, setEditorAtivo] = useState<Artigo | null>(null);
  const [showNovoArtigo, setShowNovoArtigo] = useState(false);
  const { isAdmin, token } = useAdmin();

  useEffect(() => {
    fetchArtigos();
  }, []);

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

  const handleEditarArtigo = async (e: React.MouseEvent, artigo: Artigo) => {
    e.stopPropagation();

    try {
      const response = await fetch(`/api/artigos/${artigo.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const artigoCompleto = await response.json();
        setEditorAtivo(artigoCompleto);
      }
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
    }
  };

  const handleDeletarArtigo = async (e: React.MouseEvent, artigo: Artigo) => {
    e.stopPropagation();

    if (
      !confirm(`Tem certeza que deseja deletar o artigo "${artigo.titulo}"?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/artigos/${artigo.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setArtigos(artigos.filter((a) => a.id !== artigo.id));
      } else {
        throw new Error('Erro ao deletar artigo');
      }
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      alert('Erro ao deletar artigo');
    }
  };

  const handleSalvarArtigo = (artigoAtualizado: Artigo) => {
    setArtigos(
      artigos.map((a) => (a.id === artigoAtualizado.id ? artigoAtualizado : a)),
    );
  };

  const handleNovoArtigo = (novoArtigo: Artigo) => {
    setArtigos([novoArtigo, ...artigos]);
    setShowNovoArtigo(false);
  };

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
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: '#f2f2f2' }}
      >
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
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: '#f2f2f2' }}
      >
        <Header />
        <main className="flex-grow p-6 max-w-7xl mx-auto flex justify-center items-center">
          <p className="text-xl">Nenhum Artigo encontrado.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#f2f2f2' }}
    >
      <Header />

      <main className="flex-grow p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Artigos do Museu de São José
          </h1>
          {isAdmin && artigos.length > 0 && (
            <button
              type="button"
              onClick={() => setShowNovoArtigo(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2"
            >
              <Plus size={16} />
              Novo Artigo
            </button>
          )}
        </div>

        {artigos.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum artigo encontrado</h3>
              <p className="text-gray-600 mb-4">Adicione artigos para começar a construir sua biblioteca</p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowNovoArtigo(true)}
                  className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded transition-colors"
                >
                  <Plus size={16} />
                  Adicionar Primeiro Artigo
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artigos.map((artigo) => (
              <div key={artigo.id} className="relative group">
                <button
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

                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleEditarArtigo(e, artigo)}
                      className="text-foreground p-2 rounded-full shadow-lg bg-primary"
                      title="Editar artigo"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeletarArtigo(e, artigo)}
                      className=" text-foreground p-2 rounded-full shadow-lg bg-primary"
                      title="Deletar artigo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de visualização */}
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

        {/* Editor de artigo */}
        {editorAtivo && (
          <ItemEditor
            item={editorAtivo}
            type="artigo"
            onClose={() => setEditorAtivo(null)}
            onSave={handleSalvarArtigo}
          />
        )}

        {/* Editor de novo artigo */}
        {showNovoArtigo && (
          <ItemEditor
            item={{
              id: 0,
              titulo: '',
              resumo: '',
              conteudo: '',
              imagem: '',
            }}
            type="artigo"
            onClose={() => setShowNovoArtigo(false)}
            onSave={handleNovoArtigo}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
