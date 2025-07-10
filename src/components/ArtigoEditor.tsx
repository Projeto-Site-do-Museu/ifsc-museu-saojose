'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { Edit3, FileText, Image, Save } from 'lucide-react';
import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface Artigo {
  id: number;
  titulo: string;
  resumo?: string;
  conteudo?: string;
  imagem?: string;
  dataPublicacao?: string;
}

interface ArtigoEditorProps {
  artigo: Artigo;
  onClose: () => void;
  onSave: (artigo: Artigo) => void;
}

export default function ArtigoEditor({
  artigo,
  onClose,
  onSave,
}: ArtigoEditorProps) {
  const { token } = useAdmin();
  const [formData, setFormData] = useState({
    titulo: artigo.titulo,
    resumo: artigo.resumo || '',
    conteudo: artigo.conteudo || '',
    imagem: artigo.imagem || '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setErro('');

    try {
      const isNewArtigo = artigo.id === 0;
      const url = isNewArtigo ? '/api/artigos' : `/api/artigos/${artigo.id}`;
      const method = isNewArtigo ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar');
      }

      const artigoAtualizado = await response.json();
      onSave(artigoAtualizado);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData({
      ...formData,
      imagem: imageUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-7xl max-h-[95vh] overflow-hidden border border-border shadow-2xl">
        <div className="overflow-y-auto max-h-[calc(95vh-180px)] bg-background">
          <form onSubmit={handleSubmit} className="p-8">
            {erro && (
              <div className="mb-8 bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded border-l-4 border-l-destructive">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span className="font-medium">{erro}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
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
                    placeholder="Digite o título do artigo"
                  />
                </div>

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
                  <p className="text-muted-foreground text-sm mt-2">
                    Breve descrição que será exibida nos cartões de visualização
                  </p>
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
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-muted-foreground text-xs">
                      {formData.conteudo.length} caracteres
                    </p>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-1">
                <div className="bg-card border border-border rounded p-6 shadow-sm sticky top-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Image size={20} className="text-muted-foreground" />
                    <h3 className="text-base font-semibold text-card-foreground">
                      Imagem do Acervo
                    </h3>
                  </div>

                  <div className="bg-muted/30 p-6 rounded border border-border">
                    <ImageUpload
                      currentImage={formData.imagem}
                      onImageChange={handleImageChange}
                      label=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-muted/30 border-t border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {artigo.id === 0
                ? 'Criando novo artigo'
                : `Editando artigo #${artigo.id}`}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-border text-muted-foreground hover:bg-muted hover:text-card-foreground transition-all font-medium"
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
                {loading ? 'Processando...' : 'Salvar Artigo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
