'use client';

import Footer from '@/components/Footer';
import GallerySection from '@/components/GallerySection';
import Header from '@/components/Header';

export default function PaginaAcervoCompleto() {
  return (
    <div
      className="m-auto overflow-x-hidden"
      style={{ backgroundColor: '#f2f2f2' }}
    >
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <main className="w-full overflow-hidden m-auto">
          <Header />
          <div className="w-full flex flex-col items-center justify-center mt-16 mb-12">
            <div className="bg-white/90 border border-gray-200 rounded-2xl shadow-md px-8 py-8 max-w-2xl text-center">
              <h1 className="text-4xl font-bold text-primary mb-4">
                Acervo Completo
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                Explore nossa galeria de arte, onde obras e peças selecionadas
                contam a história e a cultura de São José. Cada exposição é um
                convite para apreciar a criatividade, a memória e a diversidade
                artística do nosso acervo.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full z-0 gradient-primary">
              <div className="relative z-10 m-auto flex-1 flex flex-col items-center justify-center px-4 pt-[8vh] pb-[20px] text-center md:items-center md:text-left md:max-w-[80%]">
                <GallerySection />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
