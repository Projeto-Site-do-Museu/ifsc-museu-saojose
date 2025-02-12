"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

// Simulação dos artigos (com 18 itens para testar)
const items = [
  { id: 1, img: "/imgs/card1.png", text: "Titulo" },
  { id: 2, img: "/imgs/card1.png", text: "Titulo" },
  { id: 3, img: "/imgs/card1.png", text: "Titulo" },
  { id: 4, img: "/imgs/card1.png", text: "Titulo" },
  { id: 5, img: "/imgs/card1.png", text: "Titulo" },
  { id: 6, img: "/imgs/card1.png", text: "Titulo" },
  { id: 7, img: "/imgs/card1.png", text: "Titulo" },
  { id: 8, img: "/imgs/card1.png", text: "Titulo" },
  { id: 9, img: "/imgs/card1.png", text: "Titulo" },
  { id: 10, img: "/imgs/card1.png", text: "Titulo" },
  { id: 11, img: "/imgs/card1.png", text: "Titulo" },
  { id: 12, img: "/imgs/card1.png", text: "Titulo" },
  { id: 13, img: "/imgs/card1.png", text: "Titulo" },
  { id: 14, img: "/imgs/card1.png", text: "Titulo" },
  { id: 15, img: "/imgs/card1.png", text: "Titulo" },
  { id: 16, img: "/imgs/card1.png", text: "Titulo" },
  { id: 17, img: "/imgs/card1.png", text: "Titulo" },
  { id: 18, img: "/imgs/card1.png", text: "Titulo" }
];


export default function Home() {
  return (
    <div className="max-w-[1200px] m-auto">
      <div className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
        <main className="max-w-[1200px] overflow-hidden m-auto h-screen bg-cover bg-center md:bg-[url('/imgs/bg1.png')] bg-[url('/imgs/bg1.jpg')] gap-6">
          <Header />
          
          <div className="flex items-center justify-center">
            <div className="w-full h-screen z-0 bg-gradient-to-r from-blue-500/80 to-blue-300/10">
              <div className="relative z-10 m-auto flex-1 flex flex-col items-center justify-center px-4 pt-[16vh] pb-[20px] text-center md:items-center md:text-left md:max-w-[50%]">
                
                {/* Título da Exposição */}
                <h1 className="text-4xl font-bold text-white mb-10">Exposição de Arte</h1>

                {/* Carrossel com Grid 3x3 */}
                <div className="space-y-2 overflow-y-auto h-[75vh]"> {/* Rolagem vertical com altura fixa */}
                  {/* Linhas de Grid */}
                  {[0, 1, 2, 3, 4, 5, 6].map((rowIndex) => {
                    // Pega 3 itens por linha
                    const rowItems = items.slice(rowIndex * 3, rowIndex * 3 + 3);
                    return (
                      <div key={rowIndex} className="flex gap-8">
                        {rowItems.map((item) => (
                          <div key={item.id} className="flex-none bg-white rounded-lg shadow-lg overflow-hidden w-72">
                            <Image src={item.img} alt={`Imagem do artigo ${item.id}`} width="500" height="500" className="w-50 h-50 object-cover" />
                            <div className="p-6">
                              {/* Título do artigo menor */}
                              <p className="text-gray-600 text-center">{item.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}