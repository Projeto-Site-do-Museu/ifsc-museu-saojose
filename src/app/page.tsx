'use client';

import './globals.css';
import Footer from '@/components/Footer';
import SecondSection from '@/components/SecondSection';
import ThirdSection from '@/components/ThirdSection';
import Header from '../components/Header';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  // Abre o modal automaticamente ao carregar a página
  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <div>
      {/* Botão para abrir o pop-up manualmente */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-primary text-white px-4 py-2 rounded shadow-lg"
        onClick={() => setShowModal(true)}
      >
        Ver vídeo introdutório
      </button>

      {/* Modal com transição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-200">
          <div className="bg-black rounded-lg p-4 sm:px-3 sm:py-1 w-full max-w-lg sm:max-w-md md:max-w-2xl lg:max-w-5xl relative transform transition-all duration-200 scale-95 opacity-0 animate-modalIn mx-2">
            <p className='text-center'>Conheça o nosso Museu!</p>
            <button
              className="absolute sm:top-0 sm:right-2 sm:text-2xl top-0 right-2 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="w-full aspect-video">
              {/* Se a gente usar um video do youtube, devemos trocar a tag <video> por <iframe> */}
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

      <div className="relative min-h-screen bg-cover bg-center">
        <main className="overflow-hidden bg-cover bg-center bg-[url('/imgs/bg-mb.jpg')] md:bg-[url('/imgs/novo-bg1.jpg')] md:object-[0%_0%]">
          <Header />
          <div className="flex items-center justify-center relative z-10">
            <div className="w-full min-h-screen">
              <div className="relative flex-1 flex flex-col items-center justify-center px-4 pt-[16vh] text-center md:items-start md:text-left md:max-w-[30%] md:ml-0">
                <div className="flex flex-col bg-white py-12 px-6 border-2 border-primary rounded-xl shadow-lg">
                  <h1 className="text-3xl font-bold text-primary ">
                    Museu histórico
                    <br />
                    de São José
                  </h1>

                  <p className="text-xl mt-4 font-worksans text-primary">
                    O Museu Histórico de São José é um espaço dedicado à
                    preservação da história e cultura de nossa cidade. Através
                    de seu acervo e exposições, buscamos contar as
                    transformações de São José e celebrar suas raízes. Venha
                    conhecer e vivenciar essa história conosco!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
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
