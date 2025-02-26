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
        <div className="py-20 h-32 mb-20">
        <p className="text-3xl font-bold text-center text-white pb-20">
          Veja alguns de nossos videos do Tiktok!
        </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
        
          {/* Video 1 */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video className="w-full" controls>
              <source src="/videos/1.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>

          {/* Video 2 */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video className="w-full" controls>
              <source src="/videos/2.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>

          {/* Video 3 */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video className="w-full" controls>
              <source src="/videos/3.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>

          {/* Video 4 */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video className="w-full" controls>
              <source src="/videos/4.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>

          {/* Video 5 */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video className="w-full" controls>
              <source src="/videos/5.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>

          {/* Video 6 */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video className="w-full" controls>
              <source src="/videos/6.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>

        </div>
      </div>
      <Footer /> 
    </div>
  );
}