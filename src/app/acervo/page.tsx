"use client";

import InteractiveCarousel from "./InteractiveCarousel";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="max-w-[1200px] m-auto overflow-x-hidden">
      <div className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
        <main className="w-full h-screen overflow-hidden m-auto bg-cover bg-center md:bg-[url('/imgs/bg1.png')] bg-[url('/imgs/bg1.jpg')] gap-6">
          <Header />
          <div className="flex items-center justify-center">
            <div className="w-full h-screen z-0 bg-gradient-to-r from-blue-500/80 to-blue-300/10">
              <div className="relative z-10 m-auto flex-1 flex flex-col items-center justify-center px-4 pt-[16vh] pb-[20px] text-center md:items-center md:text-left md:max-w-[50%]">
                <h1 className="text-4xl font-michroma font-bold mb-2">
                  Acervo
                  <br />
                  do museu
                </h1>
                <p className="mt-4 font-worksans font-bold text-xs md:text-2xl">
                  O Museu Histórico de São José contém diversos itens em seu acervo que contam um pouco mais sobre a história e cultura de São José, que tal conhecer?
                </p>
              </div>
              <InteractiveCarousel />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}