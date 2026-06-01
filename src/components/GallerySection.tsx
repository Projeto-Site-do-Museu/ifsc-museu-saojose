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
import ColecaoSelector from './ColecaoSelector';
import ItemEditor from './ItemEditor';
import MediaCarousel from './MediaCarousel';

interface Item {
  id: number;
  img: string;
  text: string;
  descricao?: string;
  colecao?: string | null;
}

interface AcervoItem {
  id: number;
  titulo: string;
  nome?: string;
  numeroInventario?: string;

  descricao?: string;
  conteudo?: string;
  contextoHistorico?: string;

  artista?: string;
  colecao?: string;
  tags?: string;
  localizacao?: string;
  periodo?: string;

  dataProducao?: string;
  material?: string;
  tecnica?: string;

  altura?: string;
  largura?: string;
  profundidade?: string;

  cidadeOrigem?: string;
  estadoOrigem?: string;
  paisOrigem?: string;

  doador?: string;
  formaAquisicao?: string;
  estadoConservacao?: string;

  imagem?: string;
  imagemCapa?: string;
  fotosAdicionais?: string;
  midias?: Media[];

  textosDrive?: string;
  linkDrive?: string;
  outrasFontes?: string;

  ordem?: number;
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  const [colecaoFilter, setColecaoFilter] = useState<string>('');
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
        const acervoResponse = await fetch('/api/acervo');
        if (!acervoResponse.ok) {
          throw new Error('Falha ao buscar itens do acervo');
        }

        const acervoData = await acervoResponse.json();

        const itemsWithImages = await Promise.all(
          acervoData.map(async (acervo: any) => {
            try {
              const mediasResponse = await fetch(
                `/api/acervo/${acervo.id}/midias`,
              );

              let allImages = [acervo.imagem || acervo.imagemCapa || null].filter(Boolean) as string[];
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
                id: acervo.id,
                img: allImages[0],
                text: acervo.titulo,
                descricao: acervo.descricao,
                colecao: acervo.colecao || null,
                allImages,
                totalMedias,
                currentImageIndex: 0,
              };
            } catch (error) {
              console.error(
                `Erro ao buscar mídias para item ${acervo.id}:`,
                error,
              );
              return {
                id: acervo.id,
                img: acervo.imagem || acervo.imagemCapa || '',
                text: acervo.titulo,
                descricao: acervo.descricao,
                colecao: acervo.colecao || null,
                allImages: [acervo.imagem || acervo.imagemCapa || ''].filter(Boolean) as string[],
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

  useEffect(() => {
    if (!showCarousel) {
      // Remove modal styles when closed
      document.documentElement.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      return;
    }

    // Add modal styles when opened
    document.documentElement.classList.add('modal-open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCarousel(false);
        setViewingItem(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.documentElement.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [showCarousel]);

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
      <div className="mb-8">
        <h1 className="text-gray-950">Filtrar por coleção</h1>
        <ColecaoSelector value={colecaoFilter} onChange={setColecaoFilter} />
      </div>
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
          items
            .filter((it) => {
              if (!colecaoFilter || colecaoFilter.trim() === '') return true;
              return (it.colecao || '')
                .toLowerCase()
                .includes(colecaoFilter.toLowerCase());
            })
            .map((item) => {
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
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${index === item.currentImageIndex
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
                    {item.colecao && (
                      <div className="text-xs text-gray-500 mb-2">
                        Coleção: {item.colecao}
                      </div>
                    )}
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

      {viewingItem && showCarousel && (() => {
        const imageMedias = (viewingItem.midias || []).filter(
          (m) => m.tipo === 'imagem',
        );
        const mainImageUrl =
          imageMedias[0]?.url || viewingItem.imagemCapa || viewingItem.imagem || '';
        const otherImages = imageMedias.slice(1);

        return (
          <div
            role="dialog"
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 w-screen h-screen pointer-events-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowCarousel(false);
                setViewingItem(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowCarousel(false);
                setViewingItem(null);
              }
            }}
            tabIndex={-1}
          >
            <div
              role="document"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-4xl w-full mx-4 overflow-y-auto max-h-[90vh] shadow-2xl flex flex-col"
            >
              {/* Header com Título - Sticky */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {viewingItem.titulo}
                    </h2>
                    {viewingItem.nome && viewingItem.nome !== viewingItem.titulo && (
                      <p className="text-gray-600 mt-1">{viewingItem.nome}</p>
                    )}
                    {viewingItem.numeroInventario && (
                      <p className="text-sm text-gray-500 mt-2">
                        Nº Inventário: <strong>{viewingItem.numeroInventario}</strong>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCarousel(false);
                      setViewingItem(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                    title="Fechar (ESC)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="p-6 space-y-6">
                {/* Imagem Principal */}
                {mainImageUrl && (
                  <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={mainImageUrl}
                      alt={viewingItem.titulo}
                      width={800}
                      height={500}
                      className="w-full h-auto object-contain max-h-96"
                      unoptimized
                    />
                  </div>
                )}

                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  {viewingItem.colecao && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Coleção</p>
                      <p className="text-gray-800 font-medium">{viewingItem.colecao}</p>
                    </div>
                  )}
                  {viewingItem.periodo && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Período</p>
                      <p className="text-gray-800 font-medium">{viewingItem.periodo}</p>
                    </div>
                  )}
                  {viewingItem.dataProducao && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Data de Produção</p>
                      <p className="text-gray-800 font-medium">{viewingItem.dataProducao}</p>
                    </div>
                  )}
                  {viewingItem.artista && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Artista</p>
                      <p className="text-gray-800 font-medium">{viewingItem.artista}</p>
                    </div>
                  )}
                  {viewingItem.localizacao && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Localização</p>
                      <p className="text-gray-800 font-medium">{viewingItem.localizacao}</p>
                    </div>
                  )}
                  {viewingItem.doador && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Doador</p>
                      <p className="text-gray-800 font-medium">{viewingItem.doador}</p>
                    </div>
                  )}
                </div>

                {/* Características Técnicas */}
                {(viewingItem.material || viewingItem.tecnica || viewingItem.estadoConservacao || viewingItem.formaAquisicao) && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Características</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
                      {viewingItem.material && (
                        <p><strong className="text-gray-900">Material:</strong> {viewingItem.material}</p>
                      )}
                      {viewingItem.tecnica && (
                        <p><strong className="text-gray-900">Técnica:</strong> {viewingItem.tecnica}</p>
                      )}
                      {viewingItem.estadoConservacao && (
                        <p><strong className="text-gray-900">Estado:</strong> {viewingItem.estadoConservacao}</p>
                      )}
                      {viewingItem.formaAquisicao && (
                        <p><strong className="text-gray-900">Aquisição:</strong> {viewingItem.formaAquisicao}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dimensões */}
                {(viewingItem.altura || viewingItem.largura || viewingItem.profundidade) && (
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Dimensões</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      {viewingItem.altura && <p>Altura: <strong>{viewingItem.altura}</strong></p>}
                      {viewingItem.largura && <p>Largura: <strong>{viewingItem.largura}</strong></p>}
                      {viewingItem.profundidade && <p>Profundidade: <strong>{viewingItem.profundidade}</strong></p>}
                    </div>
                  </div>
                )}

                {/* Local de Origem */}
                {(viewingItem.cidadeOrigem || viewingItem.estadoOrigem || viewingItem.paisOrigem) && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Local de Origem</h3>
                    <p className="text-sm text-gray-700">
                      {[viewingItem.cidadeOrigem, viewingItem.estadoOrigem, viewingItem.paisOrigem]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}

                {/* Descrição */}
                {(viewingItem.descricao || viewingItem.conteudo) && (
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Descrição</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {viewingItem.descricao || viewingItem.conteudo}
                    </p>
                  </div>
                )}

                {/* Contexto Histórico */}
                {viewingItem.contextoHistorico && (
                  <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded">
                    <h3 className="font-semibold text-gray-800 mb-2">Contexto Histórico</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {viewingItem.contextoHistorico}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {viewingItem.tags && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingItem.tags.split(',').map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documentos */}
                {(viewingItem.textosDrive || viewingItem.linkDrive || viewingItem.outrasFontes) && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Documentação</h3>
                    <div className="space-y-2 text-sm">
                      {viewingItem.textosDrive && (
                        <p className="text-gray-700"><strong>Textos:</strong> {viewingItem.textosDrive}</p>
                      )}
                      {viewingItem.linkDrive && (
                        <p>
                          <a
                            href={viewingItem.linkDrive}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            📁 Acessar Google Drive
                          </a>
                        </p>
                      )}
                      {viewingItem.outrasFontes && (
                        <p className="text-gray-700"><strong>Outras fontes:</strong> {viewingItem.outrasFontes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Outras Imagens */}
                {otherImages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">
                      Galeria adicional ({otherImages.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {otherImages.map((media) => (
                        <div
                          key={media.id || media.url}
                          className="overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all"
                        >
                          <Image
                            src={media.url}
                            alt={media.titulo || 'Imagem adicional do item'}
                            width={200}
                            height={200}
                            className="w-full h-40 object-cover hover:scale-105 transition-transform"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer com Botão Fechar */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCarousel(false);
                    setViewingItem(null);
                  }}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
