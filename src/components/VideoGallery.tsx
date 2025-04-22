interface VideoGalleryProps {
  videos?: string[];
}

export default function VideoGallery({ videos = ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4"] }: VideoGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
      {videos.map((video, index) => (
        <div key={index} className="bg-background rounded-lg overflow-hidden">
          <video className="w-full" controls>
            <source src={`/videos/${video}`} type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>
      ))}
    </div>
  );
}
