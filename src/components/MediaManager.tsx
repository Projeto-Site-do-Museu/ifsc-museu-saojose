'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { Image as ImageIcon, Link, Monitor, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface Media {
  id?: number;
  tipo: 'imagem' | 'iframe';
  url: string;
  titulo?: string;
  ordem?: number;
}

interface MediaManagerProps {
  medias: Media[];
  onChange: (medias: Media[]) => void;
}

export default function MediaManager({ medias, onChange }: MediaManagerProps) {
  const { token } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlData, setUrlData] = useState({
    url: '',
    titulo: '',
    tipo: 'imagem' as 'imagem' | 'iframe',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = medias.filter((m) => m.tipo === 'imagem');
  const iframes = medias.filter((m) => m.tipo === 'iframe');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const uploadFile = async (
    file: File,
  ): Promise<{ url: string; error?: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro no upload');
      }

      const data = await response.json();
      return { url: data.url };
    } catch (error) {
      return {
        url: '',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!token) {
      setError('Token de autenticação não encontrado');
      return;
    }

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Apenas arquivos de imagem são aceitos');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Imagens devem ter no máximo 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = validFiles.map(uploadFile);
      const results = await Promise.all(uploadPromises);

      const newImages = results
        .filter((result) => result.url)
        .map((result, index) => ({
          id: Date.now() + index,
          tipo: 'imagem' as const,
          url: result.url,
          titulo: validFiles[index].name.replace(/\.[^/.]+$/, ''),
          ordem: images.length + index,
        }));

      if (newImages.length > 0) {
        const otherMedias = medias.filter((m) => m.tipo !== 'imagem');
        onChange([...images, ...newImages, ...otherMedias]);
      }

      const errorCount = results.filter((r) => r.error).length;
      if (errorCount > 0) {
        setError(`${errorCount} arquivos falharam`);
      }
    } catch (error) {
      setError('Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlData.url.trim()) {
      setError('URL é obrigatória');
      return;
    }

    if (!isValidUrl(urlData.url)) {
      setError('URL inválida');
      return;
    }

    const newMedia: Media = {
      id: Date.now(),
      tipo: urlData.tipo,
      url: urlData.url.trim(),
      titulo:
        urlData.titulo.trim() ||
        (urlData.tipo === 'iframe' ? 'Iframe' : 'Imagem externa'),
      ordem: medias.length,
    };

    onChange([...medias, newMedia]);
    setUrlData({ url: '', titulo: '', tipo: 'imagem' });
    setShowUrlInput(false);
    setError('');
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const removeMedia = (index: number, tipo: 'imagem' | 'iframe') => {
    if (tipo === 'imagem') {
      const newImages = images.filter((_, i) => i !== index);
      const otherMedias = medias.filter((m) => m.tipo !== 'imagem');
      onChange([...newImages, ...otherMedias]);
    } else {
      const newIframes = iframes.filter((_, i) => i !== index);
      const otherMedias = medias.filter((m) => m.tipo !== 'iframe');
      onChange([...otherMedias, ...newIframes]);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    const otherMedias = medias.filter((m) => m.tipo !== 'imagem');
    onChange([...newImages, ...otherMedias]);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={image.id || index} className="relative group">
              <div className="relative overflow-hidden rounded border border-border bg-card">
                <Image
                  src={image.url}
                  alt={image.titulo || `Imagem ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover"
                  unoptimized
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeMedia(index, 'imagem')}
                    className="bg-destructive text-destructive-foreground p-2 rounded"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Iframes */}
      {iframes.length > 0 && (
        <div className="space-y-2">
          {iframes.map((iframe, index) => (
            <div key={iframe.id || index} className="relative group">
              <div className="flex items-center gap-3 p-3 bg-card rounded border border-border">
                <Monitor size={20} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">
                    {iframe.titulo || 'Conteúdo incorporado'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {iframe.url}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMedia(index, 'iframe')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground p-1 rounded"
                  title="Remover"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload */}
      <div className="space-y-3">
        <button
          type="button"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer w-full ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/20 hover:bg-muted/30'
          }`}
          onClick={openFileDialog}
          aria-label="Selecionar ou arrastar arquivos para upload"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <ImageIcon size={24} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium text-card-foreground mb-2">
            {uploading ? 'Enviando...' : 'Adicionar imagens'}
          </p>
          <p className="text-xs text-muted-foreground">
            Arraste ou clique para selecionar
          </p>
        </button>

        {/* URL Externa */}
        {!showUrlInput ? (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="w-full p-3 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
          >
            <Link size={16} />
            Adicionar URL externa
          </button>
        ) : (
          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setUrlData((prev) => ({ ...prev, tipo: 'imagem' }))
                }
                className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                  urlData.tipo === 'imagem'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Imagem
              </button>
              <button
                type="button"
                onClick={() =>
                  setUrlData((prev) => ({ ...prev, tipo: 'iframe' }))
                }
                className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                  urlData.tipo === 'iframe'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Iframe
              </button>
            </div>

            <input
              type="url"
              value={urlData.url}
              onChange={(e) =>
                setUrlData((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="URL do conteúdo"
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlData.url.trim()}
                className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded text-sm disabled:opacity-50 transition-colors"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlData({ url: '', titulo: '', tipo: 'imagem' });
                  setError('');
                }}
                className="px-4 py-2 border border-border text-muted-foreground rounded text-sm hover:bg-muted/50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
