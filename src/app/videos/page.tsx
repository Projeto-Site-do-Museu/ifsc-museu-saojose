import '../globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import VideoGallery from '@/components/VideoGallery';

export default function Home() {
  return (
    <div className="max-w-[1200px] m-auto overflow-x-hidden">
      <div className="flex-grow">
        <Header />
        <div className="py-20 h-32 mb-20">
          <p className="text-3xl font-bold text-center text-primary-foreground pb-20">
            Veja alguns de nossos vídeos do Tiktok!
          </p>
        </div>
        <VideoGallery />
      </div>
      <Footer />
    </div>
  );
}
