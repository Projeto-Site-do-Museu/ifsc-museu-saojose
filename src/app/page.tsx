'use client';

import './globals.css';
import Footer from '@/components/Footer';
import IntroAcervo from '@/components/IntroAcervo';
import IntroArtigos from '@/components/IntroArtigos';
import SecondSection from '@/components/SecondSection';
import ThirdSection from '@/components/ThirdSection';
import VideoBanner from '@/components/VideoBanner';
import VisitorCounter from '@/components/VisitorCounter';
import { useEffect, useState } from 'react';
import Header from '../components/Header';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  // Abre o modal automaticamente ao carregar a página
  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <div>
      <Header />

      {/* Botão para abrir o pop-up manualmente */}
      <button
        type="button"
        className="fixed bottom-8 right-8 z-50 bg-primary text-white px-4 py-2 rounded shadow-lg font-worksans"
        onClick={() => setShowModal(true)}
      >
        Ver vídeo introdutório
      </button>

      {/* Modal com transição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-200">
          <div className="bg-black rounded-lg p-4 sm:px-3 sm:py-1 w-full max-w-lg sm:max-w-md md:max-w-2xl lg:max-w-5xl relative transform transition-all duration-200 scale-95 opacity-0 animate-modalIn mx-2">
            <p className="text-center font-worksans">Conheça o nosso Museu!</p>
            <button
              type="button"
              className="absolute sm:top-0 sm:right-2 sm:text-2xl top-0 right-2 text-2xl"
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
                Seu navegador não suporta o elemento de vídeo.
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/30 backdrop-blur-md border border-black/30 rounded-2xl shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto text-left pointer-events-auto">
              <h1 className="text-lg md:text-5xl font-bold text-white mb-4 font-worksans drop-shadow">
                Bem-vindo ao Museu Histórico de São José
              </h1>
              <p className="text-base md:text-xl text-white font-worksans">
                Descubra a história e a cultura de São José em um espaço
                dedicado à memória, à educação e à valorização das nossas
                raízes. Explore exposições, participe de eventos e viva
                experiências únicas que conectam passado, presente e futuro da
                nossa cidade.
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="mx-10 bg-black/30 backdrop-blur-md border border-black/30 rounded-2xl shadow-2xl p-6 max-w-xl text-left pointer-events-auto">
              <h1 className="text-2xl font-bold text-white mb-2 font-worksans drop-shadow">
                Bem-vindo ao Museu Histórico de São José
              </h1>
              <p className="text-sm text-white font-worksans">
                Descubra a história e a cultura de São José em um espaço
                dedicado à memória, à educação e à valorização das nossas
                raízes. Explore exposições, participe de eventos e viva
                experiências únicas que conectam passado, presente e futuro da
                nossa cidade.
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

/*
@keyframes modalIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-modalIn {
  animation: modalIn 0.2s forwards;
}
  */
