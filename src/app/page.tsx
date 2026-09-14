'use client';

import './globals.css';
import { useMuseumLanguage } from '../components/museumTranslations';
import Footer from '@/components/Footer';
import IntroAcervo from '@/components/IntroAcervo';
import IntroArtigos from '@/components/IntroArtigos';
import SecondSection from '@/components/SecondSection';
import ThirdSection from '@/components/ThirdSection';
import VideoBanner from '@/components/VideoBanner';
import VisitorCounter from '@/components/VisitorCounter';
import { useEffect, useState } from 'react';

export default function Home() {
  const { language, text } = useMuseumLanguage();
  const [showModal, setShowModal] = useState(false);

  // Abre o modal automaticamente ao carregar a página
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowModal(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  return (
    <div>
      {/* Botão para abrir o pop-up manualmente */}
      <button
        type="button"
        translate="no" lang={language} className="notranslate fixed bottom-8 right-8 z-50 bg-primary text-white px-4 py-2 rounded shadow-lg font-worksans"
        onClick={() => setShowModal(true)}
      >
        {text.watchVideo}
      </button>

      {/* Modal com transição */}
      {showModal && (
        <div translate="no" lang={language} className="notranslate fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-200">
          <div className="bg-black rounded-lg p-4 sm:px-3 sm:py-1 w-full max-w-lg sm:max-w-md md:max-w-2xl lg:max-w-5xl relative transform transition-all duration-200 scale-95 opacity-0 animate-modalIn mx-2">
            <p className="text-center font-worksans">{text.meetMuseum}</p>
            <button
              type="button"
              className="absolute sm:top-0 sm:right-2 sm:text-2xl top-0 right-2 text-2xl"
              aria-label={text.closeVideo}
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="w-full aspect-video">
              <video
                src="/videos/video_intro.mp4"
                controls
                className="w-full h-full rounded"
                poster="../../imgs/thumbnail.png"
              >
                {text.unsupportedVideo}
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Banner de vídeo centralizado, NÃO é fundo */}
      <div className="flex justify-center items-center">
        {/* Vídeo para desktop */}
        <div className="relative w-full aspect-[21/9] overflow-hidden hidden md:block">
          <VideoBanner
            src="/videos/video_capa_museu.mp4"
            aspect="aspect-[21/9]"
          />
          <div translate="no" lang={language} className="notranslate absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/30 backdrop-blur-md border border-black/30 rounded-2xl shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto text-left pointer-events-auto">
              <h1 className="text-lg md:text-5xl font-bold text-white mb-4 font-worksans drop-shadow">
                {text.welcome}
              </h1>
              <p className="text-base md:text-xl text-white font-worksans">
                {text.introduction}
              </p>
            </div>
          </div>
        </div>
        {/* Vídeo para mobile */}
        <div className="relative w-full aspect-[3/4] overflow-hidden md:hidden">
          <VideoBanner
            src="/videos/mb_video_capa_museu.mp4"
            aspect="aspect-[3/4]"
          />
          <div translate="no" lang={language} className="notranslate absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="mx-10 bg-black/30 backdrop-blur-md border border-black/30 rounded-2xl shadow-2xl p-6 max-w-xl text-left pointer-events-auto">
              <h1 className="text-2xl font-bold text-white mb-2 font-worksans drop-shadow">
                {text.welcome}
              </h1>
              <p className="text-sm text-white font-worksans">
                {text.introduction}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SecondSection />
      <IntroAcervo />
      <IntroArtigos />
      <ThirdSection />

      <VisitorCounter />

      <Footer />
    </div>
  );
}
