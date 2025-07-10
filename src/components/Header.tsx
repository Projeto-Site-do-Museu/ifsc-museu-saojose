'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full sticky top-0 z-30 bg-primary">
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
          <span className="font-worksans font-bold drop-shadow text-lg pl-5 md:pl-0 md:text-2xl max-w-[280px]">
            Museu Histórico <br /> de São José
          </span>
        </div>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex space-x-[3vw] flex-grow justify-end items-center">
          <a
            href="/about"
            className="font-worksans hover:text-accent hover:underline"
          >
            Sobre
          </a>
          <a
            href="/colecoes"
            className="font-worksans hover:text-accent hover:underline"
          >
            Coleções Culturais
          </a>
          <a
            href="/acervo"
            className="font-worksans hover:text-accent hover:underline"
          >
            Acervo
          </a>
          <a
            href="/artigos"
            className="font-worksans hover:text-accent hover:underline"
          >
            Artigos
          </a>
          <a
            href="/tour"
            className="font-worksans hover:text-accent hover:underline"
          >
            Tour Virtual
          </a>
          <a
            href="/videos"
            className="font-worksans hover:text-accent hover:underline"
          >
            Nossos Videos
          </a>
        </nav>

        {/* Botão menu mobile */}
        <button
          type="button"
          onClick={toggleMenu}
          className="md:hidden block p-2 cursor-pointer z-30 text-primary-foreground"
          aria-label="Menu"
        >
          <GiHamburgerMenu size={24} />
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-2/3 max-w-xs bg-primary z-50 p-6 flex flex-col">
          <nav className="flex flex-col space-y-4">
            <a
              href="/"
              className="font-michroma text-primary-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/about"
              className="font-michroma text-primary-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </a>
            <a
              href="/artigos"
              className="font-michroma text-primary-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Artigos
            </a>
            <a
              href="/acervo"
              className="font-michroma text-primary-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Acervo
            </a>
            <a
              href="/tour"
              className="font-michroma text-primary-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Tour Virtual
            </a>
            <a
              href="/videos"
              className="font-michroma text-primary-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Nossos Videos
            </a>
            <button
              type="button"
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
