'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { Edit3, FileText, Image, Save } from 'lucide-react';
import { useState } from 'react';
import ColecaoSelector from './ColecaoSelector';
import ImageUpload from './ImageUpload';
import MediaManager from './MediaManager';

interface BaseItem {
  id: number;
  titulo: string;
  imagem?: string;
}

interface ArtigoItem extends BaseItem {
  resumo?: string;
  conteudo?: string;
  dataPublicacao?: string;
}

interface AcervoItem extends BaseItem {
  descricao?: string;
  colecao?: string;
  createdAt?: string;
  midias?: Media[];
}

interface Media {
  id?: number;
  tipo: 'imagem' | 'iframe';
  url: string;
  titulo?: string;
  ordem?: number;
}

interface FormData {
  titulo: string;
  resumo?: string;
  conteudo?: string;
  descricao?: string;
  colecao?: string;
  imagem?: string;
  midias?: Media[];
}

type ItemType = ArtigoItem | AcervoItem;

interface ItemEditorProps {
  item: ItemType;
  type: 'artigo' | 'acervo';
  onClose: () => void;
  onSave: (item: ItemType) => void;
}

export default function ItemEditor({
  item,
  type,
  onClose,
  onSave,
}: ItemEditorProps) {
  const { token } = useAdmin();

  const [formData, setFormData] = useState<FormData>(() => {
    if (type === 'artigo') {
      const artigo = item as ArtigoItem;
      return {
        titulo: artigo.titulo,
        resumo: artigo.resumo || '',
        conteudo: artigo.conteudo || '',
        imagem: artigo.imagem || '',
      };
    }
    const acervo = item as AcervoItem;
    return {
      titulo: acervo.titulo,
      descricao: acervo.descricao || '',
      colecao: acervo.colecao || '',
      midias: acervo.midias || [],
    };
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setErro('');

    try {
      const isNewItem = item.id === 0;
      const baseUrl = type === 'artigo' ? '/api/artigos' : '/api/acervo';
      const url = isNewItem ? baseUrl : `${baseUrl}/${item.id}`;
      const method = isNewItem ? 'POST' : 'PUT';

      // Para acervo, definir a primeira imagem como principal
      const submitData = { ...formData };
      if (type === 'acervo' && formData.midias && formData.midias.length > 0) {
        const firstImage = formData.midias.find(
          (m: Media) => m.tipo === 'imagem',
        );
        submitData.imagem = firstImage?.url || '';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar');
      }

      const itemAtualizado = await response.json();
      onSave(itemAtualizado);
      onClose();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      imagem: imageUrl,
    }));
  };

  const handleMediasChange = (medias: Media[]) => {
    setFormData((prev: FormData) => ({
      ...prev,
      midias: medias,
    }));
  };

  const typeConfig = {
    artigo: {
      title: 'Artigo',
      fields: ['titulo', 'resumo', 'conteudo'],
      imageLabel: 'Imagem do Artigo',
    },
    acervo: {
      title: 'Item do Acervo',
      fields: ['titulo', 'descricao', 'colecao'],
      imageLabel: 'Imagens do Item',
    },
  };

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="bg-card border-b border-border px-8 py-6">
          <h2 className="text-3xl font-bold text-card-foreground flex items-center gap-3">
            <Edit3 size={28} className="text-muted-foreground" />
            {item.id === 0 ? `Novo ${config.title}` : `Editar ${config.title}`}
          </h2>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          {erro && (
            <div className="mx-8 mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-3 text-destructive">
                <div className="w-2 h-2 bg-destructive rounded-full" />
                <span className="font-medium">{erro}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 p-8">
              <div className="xl:col-span-2 space-y-8">
                <div className="bg-card border border-border rounded p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText size={20} className="text-muted-foreground" />
                    <label
                      htmlFor="titulo"
                      className="text-base font-semibold text-card-foreground"
                    >
                      Título
                    </label>
                    <span className="text-destructive text-sm">*</span>
                  </div>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 text-card-foreground bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-lg"
                    placeholder={`Digite o título do ${type}`}
                  />
                </div>

                {type === 'artigo' && (
                  <>
                    <div className="bg-card border border-border rounded p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText size={20} className="text-muted-foreground" />
                        <label
                          htmlFor="resumo"
                          className="text-base font-semibold text-card-foreground"
                        >
                          Resumo
                        </label>
                      </div>
                      <textarea
                        id="resumo"
                        name="resumo"
                        value={formData.resumo}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-4 text-card-foreground bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                        placeholder="Síntese que aparecerá na listagem de artigos..."
                      />
                    </div>

                    <div className="bg-card border border-border rounded p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Edit3 size={20} className="text-muted-foreground" />
                        <label
                          htmlFor="conteudo"
                          className="text-base font-semibold text-card-foreground"
                        >
                          Conteúdo
                        </label>
                      </div>
                      <textarea
                        id="conteudo"
                        name="conteudo"
                        value={formData.conteudo}
                        onChange={handleChange}
                        rows={14}
                        className="w-full px-4 py-4 text-card-foreground bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none leading-relaxed"
                        placeholder="Desenvolva aqui o conteúdo completo do artigo..."
                      />
                    </div>
                  </>
                )}

                {type === 'acervo' && (
                  <>
                    <div className="bg-card border border-border rounded p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText size={20} className="text-muted-foreground" />
                        <label
                          htmlFor="descricao"
                          className="text-base font-semibold text-card-foreground"
                        >
                          Descrição
                        </label>
                      </div>
                      <textarea
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-4 text-card-foreground bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                        placeholder="Descrição detalhada do item do acervo..."
                      />
                    </div>

                    <ColecaoSelector
                      value={formData.colecao || ''}
                      onChange={(value) =>
                        setFormData((prev: FormData) => ({
                          ...prev,
                          colecao: value,
                        }))
                      }
                    />
                  </>
                )}
              </div>

              <div className="xl:col-span-1">
                <div className="bg-card border border-border rounded p-6 shadow-sm sticky top-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Image size={20} className="text-muted-foreground" />
                    <h3 className="text-base font-semibold text-card-foreground">
                      {config.imageLabel}
                    </h3>
                  </div>

                  <div className="bg-muted/30 p-6 rounded border border-border">
                    {type === 'artigo' ? (
                      <ImageUpload
                        currentImage={formData.imagem}
                        onImageChange={handleImageChange}
                        label=""
                      />
                    ) : (
                      <MediaManager
                        medias={formData.midias || []}
                        onChange={handleMediasChange}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-muted/30 border-t border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {item.id === 0
                ? `Criando novo ${type}`
                : `Editando ${type} #${item.id}`}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-border text-muted-foreground transition-all font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !formData.titulo.trim()}
                className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
              >
                <Save size={18} />
                {loading ? 'Processando...' : `Salvar ${config.title}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
