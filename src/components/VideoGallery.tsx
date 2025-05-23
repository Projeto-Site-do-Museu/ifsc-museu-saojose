'use client';

import { useEffect, useState } from 'react';

export default function VideoGallery() {
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true); 
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
          throw new Error('Falha ao buscar vídeos');
        }
        const data = await response.json();
        setVideos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto p-4 justify-center items-center">
        <p className="text-xl text-gray-700 col-span-full text-center">Carregando vídeos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto p-4 justify-center items-center">
        <p className="text-xl text-red-500 col-span-full text-center">Erro: {error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto p-4 justify-center items-center">
        <p className="text-xl text-gray-700 col-span-full text-center">Nenhum vídeo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
      {videos.map((video) => (
        <div
          key={`video-${video}`}
          className="bg-background rounded-lg overflow-hidden"
        >
          <video className="w-full" controls>
            <source src={`/videos/${video}`} type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>
      ))}
    </div>
  );
}
