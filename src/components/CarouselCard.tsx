import Image from 'next/image';

interface CarouselCardProps {
  item: {
    id: number;
    img: string;
    text: string;
  };
  isActive: boolean;
  onClick: (id: number) => void;
}

export default function CarouselCard({
  item,
  isActive,
  onClick,
}: CarouselCardProps) {
  return (
    <div className="px-4 md:px-10 md:flex md:place-content-center">
      <button
        type="button"
        className={`rounded-xl overflow-hidden cursor-pointer border-0 p-0 ${
          isActive ? 'w-[0px] h-[0px] opacity-0' : 'w-[300px] h-[300px]'
        }`}
        onClick={() => onClick(item.id)}
      >
        <Image
          src={item.img}
          alt={`Card ${item.id}`}
          width={300}
          height={300}
          className="object-cover w-full h-64"
        />
      </button>
    </div>
  );
}
