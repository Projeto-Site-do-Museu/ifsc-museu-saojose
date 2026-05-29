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
          <a href="/" className="flex items-center">
            <Image
              src="/imgs/logo.png"
              alt="Logo"
              width={128}
              height={128}
              className="mr-3"
            />
            <span className="font-worksans font-bold drop-shadow text-lg pl-5 md:pl-0 md:text-2xl max-w-[280px]">
              Museu Histórico <br /> de São José
            </span>
          </a>
        </div>

        <nav>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16">
            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
          </svg>
        </nav>

        {/* Navegação Desktop  */}
        <nav className="hidden [@media(min-width:1010px)]:flex space-x-[3vw] flex-grow justify-end items-center">
          <a
            href="/"
            className="font-worksans hover:underline hover:bg-white/20 rounded px-4 py-3 transition-colors"
          >
            Início
          </a>
          <a
            href="/about"
            className="font-worksans hover:underline hover:bg-white/20 rounded px-4 py-3 transition-colors"
          >
            Sobre
          </a>
          <a
            href="/colecoes"
            className="font-worksans hover:underline hover:bg-white/20 rounded px-4 py-3 transition-colors"
          >
            Coleções Culturais
          </a>
          <a
            href="/acervo"
            className="font-worksans hover:underline hover:bg-white/20 rounded px-4 py-3 transition-colors"
          >
            Acervo
          </a>
          <a
            href="/artigos"
            className="font-worksans hover:underline hover:bg-white/20 rounded px-4 py-3 transition-colors"
          >
            Artigos
          </a>
          <a
            href="/tour"
            className="font-worksans hover:underline hover:bg-white/20 rounded px-4 py-3 transition-colors"
          >
            Tour Virtual
          </a>
          <a
            href="/videos"
            className="font-worksans hover:underline hover:bg-white/20 rounded px-4 py-3 transition-colors"
          >
            Nossos Videos
          </a>
          <a
            href="/jogos"
            className="font-worksans hover:underline hover:bg-white/20 rounded px-4 py-3 transition-colors"
          >
            Nossos Jogos
          </a>
        </nav>

        {/* Botão menu mobile */}
        <button
          type="button"
          onClick={toggleMenu}
          className="[@media(max-width:1009px)]:block hidden p-2 cursor-pointer z-30 text-primary-foreground"
          aria-label="Menu"
        >
          <GiHamburgerMenu size={24} />
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-2/3 max-w-xs bg-primary z-50 p-6 flex flex-col [@media(max-width:1009px)]:flex hidden">
          <nav className="flex flex-col space-y-4">
            <a
              href="/"
              className="font-michroma text-primary-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
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
