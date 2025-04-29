"use client"

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { TemplateA, TemplateB, TemplateC } from '@/components/Templates';
import { useState } from 'react';

const templates = {
  A: TemplateA,
  B: TemplateB,
  C: TemplateC,
} as const;

const renderTemplate = (templateKey: keyof typeof templates, image: string, text: string) => {
  const Component = templates[templateKey];
  return <Component image={image} text={text} />;
};

// Dados de exemplo dos artigos
const mockData = [
  {
    id: 1,
    templates: [
      { template: 'A', image: '/imgs/img1.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet quam fringilla libero rutrum lobortis. Nam id vulputate odio. Cras molestie quis ante et vestibulum. Nullam viverra leo quis libero vulputate ultricies sit amet et lorem.' },
      { template: 'B', image: '/imgs/img2.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet quam fringilla libero rutrum lobortis. Nam id vulputate odio. Cras molestie quis ante et vestibulum. Nullam viverra leo quis libero vulputate ultricies sit amet et lorem.' },
    ],
  },
  {
    id: 2,
    templates: [
      { template: 'C', image: '/imgs/img3.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet quam fringilla libero rutrum lobortis. Nam id vulputate odio. Cras molestie quis ante et vestibulum. Nullam viverra leo quis libero vulputate ultricies sit amet et lorem.' },
      { template: 'A', image: '/imgs/img4.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet quam fringilla libero rutrum lobortis. Nam id vulputate odio. Cras molestie quis ante et vestibulum. Nullam viverra leo quis libero vulputate ultricies sit amet et lorem.' },
    ],
  },
  {
    id: 3,
    templates: [
      { template: 'B', image: '/imgs/img5.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet quam fringilla libero rutrum lobortis. Nam id vulputate odio. Cras molestie quis ante et vestibulum. Nullam viverra leo quis libero vulputate ultricies sit amet et lorem.' },
      { template: 'C', image: '/imgs/img6.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet quam fringilla libero rutrum lobortis. Nam id vulputate odio. Cras molestie quis ante et vestibulum. Nullam viverra leo quis libero vulputate ultricies sit amet et lorem.' },
      { template: 'A', image: '/imgs/img6.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet quam fringilla libero rutrum lobortis. Nam id vulputate odio. Cras molestie quis ante et vestibulum. Nullam viverra leo quis libero vulputate ultricies sit amet et lorem.' },
      { template: 'B', image: '/imgs/img6.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet quam fringilla libero rutrum lobortis.' },
    ],
  },
];

export default function Artigos() {
  const [currentArticleId, setCurrentArticleId] = useState<number>(1);

  const prevArticle = () => {
    setCurrentArticleId((prev) => (prev > 1 ? prev - 1 : mockData.length));
  };

  const nextArticle = () => {
    setCurrentArticleId((prev) => (prev < mockData.length ? prev + 1 : 1));
  };

  const currentArticle = mockData.find((article) => article.id === currentArticleId);

  return (
    <div className="relative min-h-screen bg-background">
      <main className=" m-auto h-screen mb-10">
        <Header />
        <div className="pb-20"></div>
        {currentArticle?.templates.map((item) =>
          renderTemplate(item.template as keyof typeof templates, item.image, item.text)
        )}

        <div className="flex justify-center items-center mt-8">
          <button
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-l-full hover:bg-secondary/90 transition-colors"
            onClick={prevArticle}
          >
            Anterior
          </button>

          <div className="flex items-center mx-4">
            <span className="text-lg text-primary-foreground">
              Artigo {currentArticleId} de {mockData.length}
            </span>
          </div>

          <button
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-r-full hover:bg-secondary/90 transition-colors"
            onClick={nextArticle}
          >
            Próximo
          </button>
        </div>

        <Footer />
      </main>
    </div>
  );
}
