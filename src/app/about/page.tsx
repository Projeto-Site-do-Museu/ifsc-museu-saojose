"use client";

import { useState } from "react";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [modalContent, setModalContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (content: string) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="max-w-[1200px] m-auto">
      <div className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
        <main className="max-w-[1200px] overflow-hidden m-auto h-screen bg-cover bg-center md:bg-[url('/imgs/bg1.png')] bg-[url('/imgs/bg1.jpg')] gap-6">
          <Header />
          <div className=" min-w-[1200px] h-screen flex flex-col items-center justify-center ">
              <div className="flex flex-col gap-4">
              <button
                className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300"
                onClick={() => openModal("O Museu de São José está aberto ao público de terça a domingo, das 8h às 18h. Planeje sua visita e aproveite para explorar as exposições permanentes e temporárias que revelam a rica história e cultura da nossa região.")}
              >
                Horários
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300"
                onClick={() => openModal("Estamos localizados no coração de São José, na Rua Histórica nº 123, próximo à Praça Central. O acesso é fácil tanto para pedestres quanto para quem vem de carro, com estacionamento disponível nas proximidades. A localização privilegiada oferece uma experiência cultural imersiva em um dos pontos mais charmosos da cidade, o centro histórico de São José.")}
              >
                Localização
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300"
                onClick={() => openModal("Para garantir uma experiência tranquila e personalizada, recomendamos o agendamento prévio da sua visita, especialmente para grupos e escolas. Entre em contato pelo telefone (48) 3381-0000. ")}
              >
                Agende sua visita
              </button>
            </div>
          </div>
          
        </main>
      </div>

      <Footer />

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1F164D] p-6 rounded-lg shadow-lg max-w-md text-center">
            <p className="text-lg font-semibold">{modalContent}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
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
