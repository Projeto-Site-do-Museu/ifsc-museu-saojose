import Image from 'next/image';
import { FC } from 'react';

type TemplateProps = {
  image: string;
  text: string;
};

const TemplateA: FC<TemplateProps> = ({ image, text }) => {
  return (
    <div className="px-5 flex items-center gap-4 my-4 bg-gradient-to-r from-purple-500/80 to-purple-300/10">
      <div className="w-1/3 relative">
        <Image src={image} alt="Imagem" width={300} height={300} className="rounded-lg w-[200px] h-[250px] md:w-[600px] md:h-[600px]" />
      </div>
      <p className="w-2/3 text-sm md:text-lg">{text}</p>
    </div>
  );
};

const TemplateB: FC<TemplateProps> = ({ image, text }) => {
  return (
    <div className="px-5 flex items-center gap-4 my-4 flex-row-reverse bg-gradient-to-l from-purple-500/80 to-purple-300/10">
      <div className="w-1/3 relative">
        <Image src={image} alt="Imagem" width={300} height={300} className="rounded-lg w-[200px] h-[250px] md:w-[600px] md:h-[600px]" />
      </div>
      <p className="w-2/3 text-sm md:text-lg">{text}</p>
    </div>
  );
};

const TemplateC: FC<TemplateProps> = ({ image, text }) => {
  return (
    <div className="text-center my-4">
      <div className="w-1/2 mx-auto relative">
        <Image src={image} alt="Imagem" width={400} height={300} className="rounded-lg w-[200px] h-[250px] md:w-[600px] md:h-[600px]" />
      </div>
      <div className="px-5 bg-gradient-to-r from-purple-500/80 to-purple-300/10">
      <p className=" text-sm md:text-lg mt-4">{text}</p>
      </div>
      
    </div>
  );
};

export { TemplateA, TemplateB, TemplateC };