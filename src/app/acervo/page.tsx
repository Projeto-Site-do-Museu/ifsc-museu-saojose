import '../globals.css';
import AcervoActions from '@/components/AcervoActions';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import InteractiveCarousel, {
  type Item as CarouselItemData,
} from '@/components/InteractiveCarousel';

async function getCarouselData(): Promise<CarouselItemData[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/carousel`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching carousel data for /acervo page:', error);
    return [];
  }
}

export default async function AcervoPage() {
  const carouselItems = await getCarouselData();

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: '#f2f2f2', color: '#111' }}
    >
      <main className="relative flex-1">
        <Header />
        <section className="w-full min-h-screen flex flex-col items-center justify-start pt-20 pb-10">
          <div className="max-w-5xl w-full mx-auto px-6">
            <div className="bg-white/90 border border-gray-300 rounded-2xl shadow-lg shadow-gray-300/40 p-10 mb-12">
              <h1 className="text-5xl md:text-6xl font-bold font-michroma mb-6 leading-tight drop-shadow-lg text-center text-black">
                Acervo
                <span className="sm:inline hidden">&nbsp;</span>
                <span className="block sm:hidden" />
                do museu
              </h1>
              <p className="text-lg md:text-2xl font-worksans font-medium drop-shadow-md text-center text-black">
                O Museu Histórico de São José contém diversos itens em seu
                acervo que contam um pouco mais sobre a história e cultura de
                São José. Que tal conhecer?
              </p>
            </div>
            <div className="max-w-full mx-auto px-0 md:px-4">
              {carouselItems.length > 0 ? (
                <InteractiveCarousel items={carouselItems} />
              ) : (
                <p className="text-center text-gray-500">
                  Não foi possível carregar o carrossel de obras.
                </p>
              )}
            </div>

            <AcervoActions />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
