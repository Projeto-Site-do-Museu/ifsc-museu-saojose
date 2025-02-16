"use client";

import './globals.css';
import Header from '../components/Header';
import SecondSection from '@/components/SecondSection';
import ThirdSection from '@/components/ThirdSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div>
    <div className="relative min-h-screen bg-cover bg-center">
      <main className="max-w-[1200px] overflow-hidden m-auto h-screen bg-cover bg-center md:bg-[url('/imgs/bg1.png')] bg-[url('/imgs/bg1.jpg')]">
        <Header />
        <div className="flex items-center justify-center">
          <div className="w-full h-screen z-0 bg-gradient-to-r from-blue-500/80 to-blue-300/10 ">
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-[16vh] text-center md:items-start md:text-left md:max-w-[50%] md:ml-0">
              <h1 className="text-4xl font-michroma font-bold mb-2">
                Museu histórico
                <br />
                de São José
              </h1>
              
              <p className="mt-4 font-worksans font-bold text-xl md:text-2xl">
              O Museu Histórico de São José é um espaçodedicado à preservação da história e cultura de nossa cidade. Através de seu acervo e exposições, buscamos contar as transformações de São José e celebrar suas raízes. Venha conhecer e vivenciar essa história conosco!
              </p>
            </div>

          </div>
        </div>

      </main>
      

    </div>
    <SecondSection></SecondSection>
    <ThirdSection></ThirdSection>
    <Footer></Footer>
    </div>
  );
}
