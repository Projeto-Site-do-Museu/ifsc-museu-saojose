import Image from 'next/image';

interface ExpandedCardProps {
  item: {
    id: number;
    img: string;
    text: string;
  };
}

export default function ExpandedCard({ item }: ExpandedCardProps) {
  return (
    <div className="bg-background text-foreground p-4 sm:p-6 rounded-lg shadow-2xl max-w-3xl w-full mx-auto">
      <div className="relative w-full aspect-video mb-4 sm:mb-6 rounded-md overflow-hidden">
        <Image
          src={item.img}
          alt={item.text || `Artwork ${item.id}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-primary">
          {item.text}
        </h2>
      </div>
    </div>
  );
}
