"use client";

import { useState } from 'react';
import Image from 'next/image';
import { GiHamburgerMenu } from 'react-icons/gi'; 
import { FaArrowLeft } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log('Menu clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full max-h-10 flex flex-col relative z-20">
      <div className="flex justify-between items-center py-4 px-6 text-primary-foreground bg-primary">
        <div className="flex items-center">
          <a href="/">
          <Image
            src="/imgs/logo.png"
            alt="Logo"
            width={128}
            height={128}
            className="mr-3"
          />
          </a>
          <span className="font-worksans font- text-lg pl-5 md:pl-0 md:text-2xl max-w-[280px]">Museu Histórico <br/> de São José</span>
        </div>

        <nav className="hidden md:flex space-x-[3vw] flex-grow justify-end">
          <a href="/about" className="font-worksans hover:text-accent hover:underline">Sobre</a>
          <a href="/pecaMes" className="font-worksans hover:text-accent hover:underline">Peça do mês</a>
          <a href="/artigos" className="font-worksans hover:text-accent hover:underline">Artigos</a>
          <a href="/acervo" className="font-worksans hover:text-accent hover:underline">Acervo</a>
          <a href="/tour" className="font-worksans hover:text-accent hover:underline">Tour Virtual</a>
          <a href="/videos" className="font-worksans hover:text-accent hover:underline">Nossos Videos</a>
        </nav>


        <button
          onClick={toggleMenu}
          className="md:hidden block p-2 cursor-pointer z-30 text-primary-foreground"
          aria-label="Menu"
        >
          <GiHamburgerMenu size={24} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-1/2 bg-primary z-50 p-6">
          <nav className="flex flex-col space-y-4">
            <a href="/" className="font-michroma text-primary-foreground">Home</a>
            <a href="/about" className="font-michroma text-primary-foreground">Sobre</a>
            <a href="/pecaMes" className="font-michroma text-primary-foreground">Peça do mês</a>
            <a href="/artigos" className="font-michroma text-primary-foreground">Artigos</a>
            <a href="/acervo" className="font-michroma text-primary-foreground">Acervo</a>
            <a href="/tour" className="font-michroma text-primary-foreground">Tour Virtual</a>
            <a href="/videos" className="font-michroma text-primary-foreground">Nossos Videos</a>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="mt-auto flex items-center text-primary-foreground"
              aria-label="Fechar menu"
            >
              <FaArrowLeft />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
