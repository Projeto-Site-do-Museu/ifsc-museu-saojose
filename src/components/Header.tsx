"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { GiHamburgerMenu } from 'react-icons/gi'; 
import { FaArrowLeft } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full max-h-10 flex flex-col relative z-20">
      <div className="flex justify-between items-center py-4 px-6 text-white bg-[#1F164D]">
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
          <span className="font-michroma text-2xl max-w-[280px]">Museu Histórico de São josé</span>
        </div>

        <nav className="hidden md:flex space-x-[3vw] flex-grow justify-end">
          <div className="relative">
            <a href="/about" className="font-michroma">Sobre</a>
            <div className="absolute left-0 right-0 h-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-800" />
          </div>
          <a href="#" className="font-michroma">Artigos</a>
          <a href="#" className="font-michroma">Peça do mês</a>
          <a href="/acervo" className="font-michroma">Acervo</a>
          <a href="#" className="font-michroma">Tour Virtual</a>
        </nav>


        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden bg-transparent"
          aria-label="Menu"
        >
          <GiHamburgerMenu size={24} />
        </Button>
      </div>

      {/* Menu lateral mobile */}
      {isMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-1/2 bg-gradient-to-r from-gradientEnd to-gradientStart z-50 p-6">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="font-michroma text-white">Home</a>
            <a href="#" className="font-michroma text-white">O que fazemos</a>
            <a href="#" className="font-michroma text-white">Cases</a>
            <a href="#" className="font-michroma text-white">Talentos</a>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="mt-auto flex items-center text-white"
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
