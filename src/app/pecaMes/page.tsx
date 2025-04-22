// pages/index.js
import Image from 'next/image';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="max-w-[1200px] m-auto overflow-x-hidden">
      <div className="flex-grow">
        <Header />
        <section className="bg-background h-64 flex items-center justify-center">
          <Image src="/imgs/saopedro-Photoroom.png" alt="Central Image" width={300} height={300} className="object-cover" />
        </section>

        <main className="w-full h-full z-10 gradient-primary-reverse text-card-foreground">
          <div className="max-w-[50%] m-auto bg-card z-0">
            <br></br>
            <h2 className="text-center text-2xl font-bold mb-4">ESPADA DE DOM PEDRO</h2>
            <p className="text-center mb-4">ANO DE 18XX</p>
            <p className="text-justify mb-4 max-w-[85%] m-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque mattis nisi sed ultrices. Curabitur sit amet lacus eget quam finibus sollicitudin. Etiam consectetur tempus odio, sed dictum nulla tempus sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec in risus sit amet sapien sagittis luctus vitae sed purus.
            </p>
            <p className="text-justify mb-4 max-w-[85%] m-auto">
              Vivamus auctor nunc metus, ac sodales lacus hendrerit lacinia. Nam eget ex quis nibh aliquam faucibus. Aenean ac quam ut urna varius scelerisque imperdiet vel urna. Nulla sit amet vehicula nibh, in porttitor neque. Curabitur elementum laoreet elit, at egestas sapien maximus sed.
            </p>
            <br></br>

            <a href="/exposicoes/" className="flex justify-center pb-4">
              <button className="bg-accent/20 text-accent px-4 py-2 rounded hover:bg-accent/30 transition-colors">Modelo 3D</button>
            </a>
          </div>
          
        </main>
      </div>
      <Footer /> 
    </div>
  );
}
