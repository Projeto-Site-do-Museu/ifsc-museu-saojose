"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";

export default function Home() {
  return (
    <div className="max-w-[1200px] m-auto overflow-x-hidden">
      <div className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
        <main className="w-full overflow-hidden m-auto bg-cover bg-center md:bg-[url('/imgs/bg1.png')] bg-[url('/imgs/bg1.jpg')]">
          <Header />
          
          <div className="flex items-center justify-center">
            <div className="w-full z-0 gradient-primary">
              <div className="relative z-10 m-auto flex-1 flex flex-col items-center justify-center px-4 pt-[16vh] pb-[20px] text-center md:items-center md:text-left md:max-w-[80%]">
                <GallerySection />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
