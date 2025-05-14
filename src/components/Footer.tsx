import Image from 'next/image';
import React from 'react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
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
    </footer>
  );
};

export default Footer;
