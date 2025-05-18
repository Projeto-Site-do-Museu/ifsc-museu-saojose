'use client';

import './globals.css';
import Footer from '@/components/Footer';
import SecondSection from '@/components/SecondSection';
import ThirdSection from '@/components/ThirdSection';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import VideoBanner from '@/components/VideoBanner';

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
        className="fixed bottom-8 right-8 z-50 bg-primary text-white px-4 py-2 rounded shadow-lg"
        onClick={() => setShowModal(true)}
      >
        Ver vídeo introdutório
      </button>

      {/* Modal com transição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-200">
          <div className="bg-black rounded-lg p-4 sm:px-3 sm:py-1 w-full max-w-lg sm:max-w-md md:max-w-2xl lg:max-w-5xl relative transform transition-all duration-200 scale-95 opacity-0 animate-modalIn mx-2">
            <p className='text-center'>Conheça o nosso Museu!</p>
            <button
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
        <VideoBanner src="/videos/video_capa_museu.mp4" aspect="aspect-[21/9]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto text-center pointer-events-auto">
              <h1 className="text-lg md:text-5xl font-bold text-primary mb-4 font-worksans drop-shadow">
                Bem-vindo ao Museu Histórico de São José
              </h1>
              <p className="text-base md:text-xl text-primary font-worksans">
                Descubra a história e a cultura de São José em um espaço dedicado à memória, à educação e à valorização das nossas raízes.
                Explore exposições, participe de eventos e viva experiências únicas que conectam passado, presente e futuro da nossa cidade.
              </p>
            </div>
          </div>

      <SecondSection />
      <ThirdSection />
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
