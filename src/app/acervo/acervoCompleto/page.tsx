"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

// Simulação dos artigos (com 18 itens para testar)
const items = [
  { id: 1, img: "/imgs/img1.jpg", text: "Titulo" },
  { id: 2, img: "/imgs/img2.jpg", text: "Titulo" },
  { id: 3, img: "/imgs/img3.jpg", text: "Titulo" },
  { id: 4, img: "/imgs/img4.jpg", text: "Titulo" },
  { id: 5, img: "/imgs/img5.jpg", text: "Titulo" },
  { id: 6, img: "/imgs/img6.jpg", text: "Titulo" },
  { id: 7, img: "/imgs/img7.jpg", text: "Titulo" },
  { id: 8, img: "/imgs/img8.jpg", text: "Titulo" },
  { id: 9, img: "/imgs/img9.jpg", text: "Titulo" },
  { id: 10, img: "/imgs/img10.jpg", text: "Titulo" },
  { id: 11, img: "/imgs/img11.jpg", text: "Titulo" },
  { id: 12, img: "/imgs/img12.jpg", text: "Titulo" },
  { id: 13, img: "/imgs/img13.jpg", text: "Titulo" },
  { id: 14, img: "/imgs/img14.jpg", text: "Titulo" },
  { id: 15, img: "/imgs/img15.jpg", text: "Titulo" },
  { id: 16, img: "/imgs/img16.jpg", text: "Titulo" },
  { id: 17, img: "/imgs/img17.jpg", text: "Titulo" },
  { id: 18, img: "/imgs/img18.jpg", text: "Titulo" },
  { id: 19, img: "/imgs/img19.jpg", text: "Titulo" },
  { id: 20, img: "/imgs/img20.jpg", text: "Titulo" },
  { id: 21, img: "/imgs/img21.jpg", text: "Titulo" },
  { id: 22, img: "/imgs/img22.jpg", text: "Titulo" },
  { id: 23, img: "/imgs/img23.jpg", text: "Titulo" },
  { id: 24, img: "/imgs/img24.jpg", text: "Titulo" },
];

export default function Home() {
  return (
    <div className="max-w-[1200px] m-auto overflow-x-hidden">
      <div className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
        <main className="w-full overflow-hidden m-auto bg-cover bg-center md:bg-[url('/imgs/bg1.png')] bg-[url('/imgs/bg1.jpg')]">
          <Header />

          <div className="flex items-center justify-center">
            <div className="w-full z-0 bg-gradient-to-r from-blue-500/80 to-blue-300/10">
              <div className="relative z-10 m-auto flex-1 flex flex-col items-center justify-center px-4 pt-[16vh] pb-[20px] text-center md:items-center md:text-left md:max-w-[50%]">

                <h1 className="text-4xl font-bold text-white mb-10">Exposição de Arte</h1>

                <div className="w-full overflow-y-auto no-scrollbar h-[75vh] p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                      >
                        <Image
                          src={item.img}
                          alt={`Imagem do artigo ${item.id}`}
                          width={300}
                          height={300}
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                          <p className="text-gray-600 text-center">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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