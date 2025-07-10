'use client';

import { useAdmin } from '@/contexts/AdminContext';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import AdminLogin from './AdminLogin';

interface AdminUser {
  id: number;
  nome: string;
  email: string;
  role: string;
}

const Footer = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [notificacao, setNotificacao] = useState('');
  const { isAdmin, adminUser, login, logout } = useAdmin();

  const handleAdminLoginSuccess = (token: string, user: AdminUser) => {
    login(token, user);
    setShowAdminLogin(false);
    setNotificacao('Login realizado com sucesso!');
    setTimeout(() => setNotificacao(''), 3000);
  };

  const handleAdminLogout = () => {
    logout();
    setNotificacao('Logout realizado');
    setTimeout(() => setNotificacao(''), 3000);
  };

  return (
    <>
      {notificacao && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999] transition">
          {notificacao}
        </div>
      )}

      <footer className="bg-primary w-full">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 md:gap-0">
          <div className="flex flex-row items-center justify-center md:justify-start w-full md:w-auto">
            <Image
              src="/imgs/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="mr-2 md:mr-3"
            />
            <div className="text-center md:text-left">
              <h1 className="text-primary-foreground font-worksans text-base md:text-lg">
                Museu histórico de São José
              </h1>
              <p className="text-muted-foreground text-xs hidden md:block">
                Rua Gaspar Neves, 3175 - 88103-250
              </p>
              <p className="text-muted-foreground text-xs ">(48) 3381-0000</p>
              <p className="text-muted-foreground text-xs ">
                Horários: de segunda a sexta feira, das 8:00 às 18:00 horas.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-primary-foreground font-worksans text-sm">
              Nossas Redes
            </h2>
            <div className="flex space-x-4 mt-2">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-primary-foreground text-2xl hover:text-muted-foreground" />
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="text-primary-foreground text-2xl hover:text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Área discreta do administrador */}
        <div className="border-t border-primary-foreground/20 px-4 py-2">
          <div className="flex justify-between items-center text-xs">
            <p className="text-muted-foreground">
              © 2024 Museu Histórico de São José
            </p>
            <div>
              {!isAdmin ? (
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(true)}
                  className="text-muted-foreground hover:text-primary-foreground text-xs underline"
                >
                  Admin
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {adminUser?.nome || adminUser?.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="text-muted-foreground hover:text-primary-foreground text-xs underline"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Admin Login */}
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-2 relative">
              <AdminLogin
                onClose={() => setShowAdminLogin(false)}
                onLoginSuccess={handleAdminLoginSuccess}
              />
            </div>
          </div>
        )}
      </footer>
    </>
  );
};

export default Footer;
