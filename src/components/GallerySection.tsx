'use client';

import { useAdmin } from '@/contexts/AdminContext';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Image as ImageIcon,
  Plus,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ItemEditor from './ItemEditor';
import MediaCarousel from './MediaCarousel';

interface Item {
  id: number;
  img: string;
  text: string;
  descricao?: string;
}

interface AcervoItem {
  id: number;
  titulo: string;
  descricao?: string;
  colecao?: string;
  ordem?: number;
  imagem?: string;
  midias?: Media[];
}

interface Media {
  id?: number;
  tipo: 'imagem' | 'iframe';
  url: string;
  titulo?: string;
  ordem?: number;
}

interface ItemWithImages extends Item {
  allImages: string[];
  totalMedias: number;
  currentImageIndex: number;
}

export default function GallerySection() {
  const [items, setItems] = useState<ItemWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<AcervoItem | null>(null);
  const [viewingItem, setViewingItem] = useState<AcervoItem | null>(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const { isAdmin, token } = useAdmin();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Buscar itens da galeria
        const galleryResponse = await fetch('/api/gallery');
        if (!galleryResponse.ok) {
          throw new Error('Falha ao buscar itens da galeria');
        }
        const galleryData = await galleryResponse.json();

        // Para cada item, buscar suas mídias para criar o carrossel
        const itemsWithImages = await Promise.all(
          galleryData.map(async (item: Item) => {
            try {
              const mediasResponse = await fetch(
                `/api/acervo/${item.id}/midias`,
              );

              let allImages = [item.img];
              let totalMedias = 1;

              if (mediasResponse.ok) {
                const midias = await mediasResponse.json();
                const imagemUrls = midias
                  .filter((m: Media) => m.tipo === 'imagem')
                  .map((m: Media) => m.url);

                if (imagemUrls.length > 0) {
                  allImages = imagemUrls;
                }

                totalMedias = midias.length;
              }

              return {
                ...item,
                allImages,
                totalMedias,
                currentImageIndex: 0,
              };
            } catch (error) {
              console.error(
                `Erro ao buscar mídias para item ${item.id}:`,
                error,
              );
              return {
                ...item,
                allImages: [item.img],
                totalMedias: 1,
                currentImageIndex: 0,
              };
            }
          }),
        );

        setItems(itemsWithImages);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = () => {
    setEditingItem(null);
    setShowEditor(true);
  };

  const handleEditItem = async (item: Item) => {
    try {
      const [itemResponse, mediasResponse] = await Promise.all([
        fetch(`/api/acervo/${item.id}`),
        fetch(`/api/acervo/${item.id}/midias`),
      ]);

      if (itemResponse.ok) {
        const itemCompleto = await itemResponse.json();
        let midias: Media[] = [];

        if (mediasResponse.ok) {
          midias = await mediasResponse.json();
        }

        setEditingItem({ ...itemCompleto, midias });
        setShowEditor(true);
      }
    } catch (error) {
      console.error('Erro ao buscar item para edição:', error);
    }
  };

  const handleViewItem = async (item: Item) => {
    try {
      const [itemResponse, mediasResponse] = await Promise.all([
        fetch(`/api/acervo/${item.id}`),
        fetch(`/api/acervo/${item.id}/midias`),
      ]);

      if (itemResponse.ok) {
        const itemCompleto = await itemResponse.json();
        let midias: Media[] = [];

        if (mediasResponse.ok) {
          midias = await mediasResponse.json();
        }

        setViewingItem({ ...itemCompleto, midias });
        setShowCarousel(true);
      }
    } catch (error) {
      console.error('Erro ao buscar item:', error);
    }
  };

  const handleDeleteItem = async (item: Item) => {
    if (!token) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja deletar "${item.text}"?`,
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/acervo/${item.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setItems(items.filter((i) => i.id !== item.id));
      } else {
        const errorData = await response.json();
        alert(`Erro ao deletar: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      alert('Erro ao deletar item');
    }
  };

  const handleSaveItem = (savedItem: AcervoItem) => {
    // Recarregar a galeria após salvar
    window.location.reload();
  };

  const navigateImage = (itemId: number, direction: 'prev' | 'next') => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const totalImages = item.allImages.length;
          let newIndex = item.currentImageIndex;

          if (direction === 'prev') {
            newIndex = newIndex === 0 ? totalImages - 1 : newIndex - 1;
          } else {
            newIndex = newIndex === totalImages - 1 ? 0 : newIndex + 1;
          }

          return { ...item, currentImageIndex: newIndex };
        }
        return item;
      }),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Carregando galeria...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Galeria do Acervo
          </h1>
          <p className="text-gray-600">
            Explore os itens do acervo do Museu Histórico de São José
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded"
          >
            <Plus size={20} />
            Adicionar Item
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum item no acervo
              </h3>
              <p className="text-gray-600 mb-4">
                Adicione itens para começar a construir sua galeria
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} />
                  Adicionar Primeiro Item
                </button>
              )}
            </div>
          </div>
        ) : (
          items.map((item) => {
            const currentImage = item.allImages[item.currentImageIndex];
            const hasMultipleImages = item.allImages.length > 1;
            const hasMultipleMedias = item.totalMedias > 1;

            return (
              <button
                type="button"
                key={item.id}
                className="group relative bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left w-full"
                onClick={() => handleViewItem(item)}
              >
                {/* Área da imagem com fundo preto */}
                <div className="relative w-full aspect-square bg-black flex items-center justify-center p-4">
                  <Image
                    src={currentImage}
                    alt={item.text}
                    width={300}
                    height={300}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />

                  {/* Navegação de imagens */}
                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage(item.id, 'prev');
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage(item.id, 'next');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight size={16} />
                      </button>

                      {/* Indicadores */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {item.allImages.map((_, index) => (
                          <div
                            key={`${item.id}-indicator-${index}`}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              index === item.currentImageIndex
                                ? 'bg-white'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Contador de mídias */}
                  {hasMultipleMedias && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {hasMultipleImages
                        ? `${item.currentImageIndex + 1}/${item.allImages.length}${item.totalMedias > item.allImages.length ? ` • ${item.totalMedias} total` : ''}`
                        : `${item.totalMedias} mídias`}
                    </div>
                  )}

                  {/* Controles admin */}
                  {isAdmin && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditItem(item);
                        }}
                        className="text-foreground p-2 rounded-full shadow-lg bg-primary"
                        title="Editar"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item);
                        }}
                        className="text-foreground p-2 rounded-full shadow-lg bg-primary"
                        title="Deletar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Área de informações */}
                <div className="bg-white p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-3">
                    {item.text}
                  </h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    {item.descricao && (
                      <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                        {item.descricao}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {showEditor && (
        <ItemEditor
          item={editingItem || { id: 0, titulo: '' }}
          type="acervo"
          onClose={() => {
            setShowEditor(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}

      {/* Modal de visualização com carrossel */}
      {viewingItem && showCarousel && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="max-w-7xl w-full h-full">
            {viewingItem.midias && viewingItem.midias.length > 0 ? (
              <MediaCarousel
                medias={viewingItem.midias.map((m) => ({
                  ...m,
                  id: m.id || 0,
                }))}
                isOpen={true}
                onClose={() => {
                  setShowCarousel(false);
                  setViewingItem(null);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-xl mb-4">Nenhuma mídia disponível</p>
                  <p className="text-gray-300">{viewingItem.titulo}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
