import '../globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import VideoGallery from '@/components/VideoGallery';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary via-black/80 to-primary text-primary-foreground">
      <Header />

      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Vídeos nas Redes Sociais
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/80 font-medium">
          Confira uma seleção de vídeos do nosso museu que fizeram sucesso nas redes sociais! Um olhar descontraído e educativo sobre nosso acervo e curiosidades históricas.
        </p>
        <div className="flex justify-center mt-8">
          <a
            href="https://www.tiktok.com/@seudomuseu"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 px-6 py-3 bg-black text-[#25F4EE] font-semibold rounded-full shadow-md hover:scale-105 transition-all duration-300"
          >
            <span
              className="relative z-10"
              style={{
                textShadow: `
                  1px 1px 2px #FE2C55,
                  -1px -1px 2px #25F4EE,
                  0 0 2px #fff
                `,
              }}
            >
              Siga no TikTok
            </span>
          </a>
        </div>
      </section>

      <section className="px-4 md:px-8 mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">Galeria de Vídeos</h2>
        <VideoGallery />
      </section>

      <Footer />
    </div>
  );
}
