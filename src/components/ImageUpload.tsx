'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { CheckCircle, Image as ImageIcon, Link, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  label = 'Imagem',
}: ImageUploadProps) {
  const { token } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadedFromLocal, setUploadedFromLocal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!token) {
      setError('Token de autenticação não encontrado');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }

      const { url } = await response.json();
      onImageChange(url);
      setUploadedFromLocal(true);
      setShowUrlInput(false);
      setUrlInput('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setUploadedFromLocal(false);
      setShowUrlInput(false);
      setUrlInput('');
      setError('');
    }
  };

  const clearImage = () => {
    onImageChange('');
    setUploadedFromLocal(false);
    setShowUrlInput(false);
    setUrlInput('');
    setError('');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {label && (
        <h4 className="text-base font-semibold text-card-foreground flex items-center gap-2">
          <ImageIcon size={18} className="text-muted-foreground" />
          {label}
        </h4>
      )}

      {/* Preview da imagem atual */}
      {currentImage && (
        <div className="relative group">
          <div className="relative overflow-hidden rounded border border-border bg-card">
            <img
              src={currentImage}
              alt="Imagem selecionada"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={clearImage}
                className="bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors shadow-lg"
                title="Remover imagem"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          {uploadedFromLocal && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle size={16} className="text-accent" />
              <span>Imagem carregada com sucesso</span>
            </div>
          )}
        </div>
      )}

      {/* Área de upload */}
      {!currentImage && (
        <button
          type="button"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative w-full border-2 border-dashed rounded p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground bg-muted/20'
          }`}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <ImageIcon size={28} className="text-muted-foreground" />
            </div>

            <div>
              <p className="text-card-foreground font-medium mb-2">
                Arraste uma imagem para esta área
              </p>
              <button
                type="button"
                disabled={uploading}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded  transition-colors disabled:opacity-50 font-medium"
              >
                <Upload size={16} />
                {uploading ? 'Enviando...' : 'Selecionar Arquivo'}
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">
                Formatos aceitos: PNG, JPG, GIF
              </p>
              <p className="text-muted-foreground text-xs">
                Tamanho máximo: 5MB
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Separador e opção URL */}
      {!currentImage && !showUrlInput && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-4 text-muted-foreground">ou</span>
          </div>
        </div>
      )}

      {/* Botão para usar URL */}
      {!currentImage && !showUrlInput && (
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="w-full flex items-center justify-center gap-2 border border-border text-muted-foreground px-4 py-3 rounded hover:bg-muted hover:text-card-foreground transition-all"
        >
          <Link size={16} />
          Usar URL externa
        </button>
      )}

      {/* Campo URL */}
      {showUrlInput && !uploadedFromLocal && (
        <div className="space-y-3 p-4 bg-muted/30 rounded border border-border">
          <label
            htmlFor="image-url"
            className="block text-sm font-medium text-card-foreground"
          >
            URL da imagem
          </label>
          <div className="flex gap-2">
            <input
              id="image-url"
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 px-4 py-3 text-card-foreground bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
            >
              Aplicar
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput('');
            }}
            className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
          >
            Cancelar URL
          </button>
        </div>
      )}

      {/* Exibir erro */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
