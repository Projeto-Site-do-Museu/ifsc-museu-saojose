import Footer from '@/components/Footer';
import Header from '@/components/Header';
import InteractiveCarousel, {
  type Item as CarouselItemData,
} from '@/components/InteractiveCarousel';

const mockAfricana: CarouselItemData[] = [
  { id: 3, img: '/imgs/img-teste7.jpg', text: 'Coroa Africana' },
  { id: 1, img: '/imgs/img-teste6.jpg', text: 'Estátuas' },
  { id: 2, img: '/imgs/img-teste5.jpeg', text: 'Estampas Africanas' },
  { id: 4, img: '/imgs/img13.jpg', text: 'Máscara Africana' },
];

const mockIndigena: CarouselItemData[] = [
  { id: 1, img: '/imgs/img-teste3.jpeg', text: 'Pulseiras' },
  { id: 2, img: '/imgs/img-teste1.jpg', text: 'Brincos e Correntes' },
  { id: 3, img: '/imgs/img-teste2.jpg', text: 'Cocar' },
  { id: 4, img: '/imgs/img-teste4.jpg', text: 'Zarabatana' },
];

export default function ColecoesPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#222] text-white font-worksans">
      <Header />

      <main className="flex-1 px-4 md:px-10">
        <section className="w-full pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Coleções Culturais
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Explore objetos do acervo do Museu Histórico de São José que
              celebram as culturas africana e indígena.
            </p>
          </div>

          {/* Carrossel Africano */}
          <div className="mt-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-red-500">Coleç</span>
              <span className="text-yellow-500">ão Afri</span>
              <span className="text-green-500">cana</span>
            </h2>
            <div className="bg-black rounded-xl">
              <InteractiveCarousel items={mockAfricana} />
            </div>
          </div>

          {/* Carrossel Indígena */}
          <div className="mt-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-left">
              <span className="text-green-400">Col</span>
              <span className="text-red-400">eç</span>
              <span className="text-yellow-500">ão In</span>
              <span className="text-red-400">di</span>
              <span className="text-blue-400">gena</span>
            </h2>
            <div className="bg-black rounded-xl p-4">
              <InteractiveCarousel items={mockIndigena} />
            </div>
          </div>

          {/* Botão */}
          <div className="mt-20 flex justify-center">
            <a href="/acervo/completo">
              <button
                type="button"
                className="bg-white text-black px-8 py-4 rounded-xl text-lg md:text-xl font-semibold shadow hover:scale-105 hover:bg-gray-200 transition"
              >
                Conheça nosso acervo completo!
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
