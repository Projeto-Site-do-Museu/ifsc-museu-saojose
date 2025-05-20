'use client';

import InteractiveCarousel from '@/components/InteractiveCarousel';
import '../globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-50">
      <main className="relative flex-1 bg-cover bg-center md:bg-[url('/imgs/bg1.png')] bg-[url('/imgs/bg1.jpg')]">
        <Header />
        <section className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-black/70 to-black/30 text-white">
          <div className="max-w-5xl mx-auto px-6 text-center md:text-left space-y-12">
            <h1 className="text-5xl md:text-6xl font-bold font-michroma mb-6 leading-tight drop-shadow-lg text-center">
              Acervo
              <span className="sm:inline hidden">&nbsp;</span>
              <span className="block sm:hidden" />
              do museu
            </h1>
            <p className="text-lg md:text-2xl font-worksans font-medium drop-shadow-md text-center">
              O Museu Histórico de São José contém diversos itens em seu acervo
              que contam um pouco mais sobre a história e cultura de São José.
              Que tal conhecer?
            </p>
            <div className="max-w-6xl mx-auto px-4">
              <InteractiveCarousel />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
