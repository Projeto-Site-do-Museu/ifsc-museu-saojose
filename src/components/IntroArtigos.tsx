import React from 'react';

export default function IntroArtigos() {
  return (
    <section
      className="w-full flex justify-center items-center py-16 px-4"
      style={{ backgroundColor: '#111111' }}
    >
      <div className="w-full max-w-none md:max-w-7xl bg-black/80 rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12 transition-all duration-300">
        {/* Imagem ou ilustração à esquerda no desktop, em cima no mobile */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src="/imgs/img_intro_artigos.jpg"
            alt="Ilustração Artigos"
            className="w-full h-100% md:h-[400px] rounded-xl border shadow-lg bg-white/10"
          />
        </div>
        {/* Texto à direita no desktop, embaixo no mobile */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-worksans drop-shadow mb-2">
            Conheça nossos Artigos e Pesquisas
          </h2>
          <p className="text-lg md:text-xl text-white font-worksans">
            A página de Artigos reúne publicações, pesquisas, relatos e
            conteúdos exclusivos sobre o Museu Histórico de São José, sua
            história, acervo e temas relacionados à cultura local.
          </p>
          <ul className="text-base md:text-lg text-white/90 font-worksans list-disc list-inside space-y-1">
            <li>Leia artigos escritos por especialistas e pesquisadores</li>
            <li>Descubra curiosidades e fatos inéditos sobre o museu</li>
            <li>Aprofunde-se em temas históricos e culturais</li>
            <li>Fique por dentro das novidades e eventos acadêmicos</li>
          </ul>
          <a
            href="/artigos"
            className="w-full md:w-auto flex justify-center md:justify-start"
          >
            <button
              type="button"
              className="mt-4 bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold shadow-md hover:bg-accent hover:text-white transition-all duration-300"
            >
              Acesse nossos artigos
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
