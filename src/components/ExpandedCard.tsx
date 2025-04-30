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
    <div className="flex flex-col md:flex-row transition-all duration-300 rounded-xl">
      <Image
        src={item.img}
        alt={`Card ${item.id}`}
        width={400}
        height={400}
        className="object-cover rounded-2xl"
      />
      <p className="pl-5 text-2xl font-bold text-white transition-opacity duration-300">
        {item.text}
      </p>
    </div>
  );
}
