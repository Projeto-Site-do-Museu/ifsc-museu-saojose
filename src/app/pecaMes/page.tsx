// pages/index.js
import Image from 'next/image';
import { useState } from "react";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
          <div className="max-w-[1200px] m-auto overflow-x-hidden">

      <div className="flex-grow">
        <Header />
        <section className="bg-black h-64 flex items-center justify-center">
          <Image src="/imgs/saopedro-Photoroom.png" alt="Central Image" width={300} height={300} className="object-cover" />
        </section>

        <main className="p-7 bg-white text-black">
          <br></br>
          <h2 className="text-center text-2xl font-bold mb-4">ESPADA DE SÃO PEDRO</h2>
          <p className="text-center mb-4">ANO DE 18XX</p>
          <p className="text-justify mb-4 max-w-[50%] m-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque mattis nisi sed ultrices. Curabitur sit amet lacus eget quam finibus sollicitudin. Etiam consectetur tempus odio, sed dictum nulla tempus sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec in risus sit amet sapien sagittis luctus vitae sed purus.
          </p>
          <p className="text-justify mb-4 max-w-[50%] m-auto">
            Vivamus auctor nunc metus, ac sodales lacus hendrerit lacinia. Nam eget ex quis nibh aliquam faucibus. Aenean ac quam ut urna varius scelerisque imperdiet vel urna. Nulla sit amet vehicula nibh, in porttitor neque. Curabitur elementum laoreet elit, at egestas sapien maximus sed.
          </p>
          <br></br>

          <div className="flex justify-center mb-4">
            <button className="bg-green-200 text-green-800 px-4 py-2 rounded">Modelo 3D</button>
          </div>
        </main>
      </div>
      <Footer /> {/* O Footer agora está fora do contêiner de largura limitada */}
    </div>
  );
}