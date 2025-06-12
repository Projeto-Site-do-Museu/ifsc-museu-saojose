'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<{ nome: string; email: string } | null>(
    null,
  );
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [notificacao, setNotificacao] = useState('');

  // Carrega usuário do localStorage ao montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('usuario');
      if (userData) {
        setUser(JSON.parse(userData));
        setNotificacao('Login realizado com sucesso!');
        setTimeout(() => setNotificacao(''), 3000);
      }
    }
  }, []);

  // Função chamada após login
  const handleLoginSuccess = (usuario: { nome: string; email: string }) => {
    setUser(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setShowLogin(false);
    setShowRegister(false);
    setNotificacao('Login realizado com sucesso!');
    setTimeout(() => setNotificacao(''), 3000);
  };

  // Função para logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('usuario');
    setShowAccountMenu(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Fecha todos os modais
  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <header className="w-full sticky top-0 z-30 bg-primary">
      {notificacao && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-[9999] transition">
          {notificacao}
        </div>
      )}
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
          {!user ? (
            <>
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="ml-4 px-4 py-2 bg-white text-primary rounded font-bold border border-primary hover:bg-primary hover:text-white transition"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="ml-2 px-4 py-2 bg-accent text-white rounded font-bold border border-accent hover:bg-white hover:text-accent transition"
              >
                Cadastrar
              </button>
            </>
          ) : (
            <div className="relative ml-4">
              <button
                type="button"
                className="px-4 py-2 bg-white text-primary rounded font-bold border border-primary hover:bg-primary hover:text-white transition"
                onClick={() => setShowAccountMenu((open) => !open)}
                aria-haspopup="true"
                aria-expanded={showAccountMenu}
              >
                Minha conta
              </button>
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <div className="px-4 py-2 text-primary font-semibold border-b">
                    {user.nome}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-black w-full text-left px-4 py-2 hover:bg-accent hover:text-white transition"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
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
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(true);
                    setIsMenuOpen(false);
                  }}
                  className="mt-4 px-4 py-2 bg-white text-primary rounded font-bold border border-primary hover:bg-primary hover:text-white transition"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(true);
                    setIsMenuOpen(false);
                  }}
                  className="mt-2 px-4 py-2 bg-accent text-white rounded font-bold border border-accent hover:bg-white hover:text-accent transition"
                >
                  Cadastrar
                </button>
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                <span className="px-4 py-2 bg-white text-primary rounded font-bold border border-primary">
                  {user.nome}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-accent text-black rounded font-bold border border-accent hover:bg-white hover:text-accent transition"
                >
                  Sair
                </button>
              </div>
            )}
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

      {/* Modal Login */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-2 relative">
            <LoginForm
              onClose={closeModals}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}

      {/* Modal Cadastro */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-2 relative">
            <RegisterForm
              onClose={closeModals}
              onRegisterSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}
    </header>
  );
}
