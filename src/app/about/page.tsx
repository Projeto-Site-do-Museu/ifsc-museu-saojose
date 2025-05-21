'use client';

import { useState } from 'react';
import '../globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Home() {
  const [modalContent, setModalContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (content: string) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* CABEÇALHO COM IMAGEM DE FUNDO + NAVEGAÇÃO */}
      <header
        className="relative h-[500px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/imgs/bg1.png')" }}
      >
        <div className="absolute inset-0 bg-black/65 z-0" />

        {/* NAVBAR FUNCIONAL */}
        <div className="relative z-10">
          <Header />
        </div>

        {/* TÍTULO CENTRAL NO CABEÇALHO */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 pb-14 ">
          <h1 className="text-4xl font-bold">Museu de São José</h1>
          <p className="text-lg mt-4 max-w-xl">
            Descubra a história e a cultura da nossa região em um ambiente
            acolhedor e educativo.
          </p>
        </div>
      </header>

      {/* SEÇÕES */}
      <main className="w-full bg-background px-4 py-12 flex flex-col gap-12 items-center">
        {/* HORÁRIOS */}
        <section className="max-w-4xl w-full bg-white p-6 rounded-xl text-black">
          <h2 className="text-2xl font-bold mb-4 text-center">Horários</h2>
          <p className="text-lg text-center">
            O Museu de São José está aberto ao público de terça a domingo, das
            8:00h às 18:00h. Planeje sua visita e aproveite para explorar as
            exposições permanentes e temporárias que revelam a rica história e
            cultura da nossa região.
          </p>
        </section>

        {/* LOCALIZAÇÃO COM MAPA */}
        <section className="max-w-4xl w-full bg-white p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
          {/* Mapa à esquerda (em telas médias para cima) */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.7614021730676!2d-48.63141538494484!3d-27.612236982832057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952738b6c6a39661%3A0x6beeea7a2577db5e!2sRua%20Hist%C3%B3rica%2C%20S%C3%A3o%20Jos%C3%A9%20-%20SC!5e0!3m2!1spt-BR!2sbr!4v1680206062241!5m2!1spt-BR!2sbr"
            width="100%"
            height="300"
            className="md:w-1/2 rounded-lg border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização do Museu de São José"
          />

          {/* Texto à direita */}
          <div className="w-full md:w-1/2 text-black text-center md:text-left">
            <h2 className="text-2xl font-bold mb-4">Localização</h2>
            <p className="text-lg">
              Estamos localizados no coração de São José, na Rua Histórica nº
              123, próximo à Praça Central. O acesso é fácil tanto para
              pedestres quanto para quem vem de carro, com estacionamento
              disponível nas proximidades. A localização privilegiada oferece
              uma experiência cultural imersiva em um dos pontos mais charmosos
              da cidade, o centro histórico de São José.
            </p>
          </div>
        </section>

        {/* AGENDAMENTO */}
        <section className="max-w-4xl w-full bg-white p-6 rounded-xl text-black">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Agende sua visita
          </h2>
          <p className="text-lg text-center">
            Para garantir uma experiência tranquila e personalizada,
            recomendamos o agendamento prévio da sua visita, especialmente para
            grupos e escolas. Entre em contato pelo telefone (48) 3247-0059.
          </p>
        </section>
      </main>

      {/* RODAPÉ */}
      <Footer />

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-lg mx-auto">
            <p className="text-lg font-semibold text-black">{modalContent}</p>
            <button
              type="button"
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              onClick={closeModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
