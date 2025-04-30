'use client';

import './globals.css';
import Footer from '@/components/Footer';
import SecondSection from '@/components/SecondSection';
import ThirdSection from '@/components/ThirdSection';
import Header from '../components/Header';

export default function Home() {
  return (
    <div>
      <div className="relative min-h-screen bg-cover bg-center">
        <main className="overflow-hidden bg-cover bg-center bg-[url('/imgs/bg-mb.jpg')] md:bg-[url('/imgs/novo-bg1.jpg')] md:object-[0%_0%]">
          <Header />
          <div className="flex items-center justify-center relative z-10">
            <div className="w-full h-screen">
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
