'use client';

import { useState } from 'react';

export default function Jogos() {
  const [jogoSelecionado, setJogoSelecionado] = useState<string | null>(null);

  const jogos = [
    {
      id: 'jogoPesca',
      nome: 'Pesca Cultural',
      img: '/jogos/jogoPesca/assets/tela inicial/vertical.png',
      descricao:
        'Resgate obras culturais perdidas enquanto desvia de animais marítimos.',
      iframe: 'jogos/jogoPesca/index.html',
    },
    {
      id: 'jogoIsac',
      nome: 'Detetive no Museu',
      img: '/jogos/jogoIsac/assets/logo.jpg',
      descricao: 'Investigue mistérios dentro do museu de São José.',
      iframe: 'jogos/jogoIsac/index.html',
    },
    {
      id: 'JogoResgateReliquiasSJ',
      nome: 'Missão de resgate as reliquias de São José',
      img: '/jogos/jogomissaoResgateSJ/assets/tela_inicial_1280x720.png',
      descricao:
        'DESCRICAO AQUI: Missão de resgate as reliquias de São José.',
      iframe: 'jogos/jogoMissaoResgateSJ/index.html',
    },
    {
      id: 'JogoMuseuOuro',
      nome: 'Museu do ouro',
      img: '/jogos/jogoMuseuOuro/img/sprites/terra.jpeg',
      descricao:
      'DESCRICAO AQUI: museu do ouro SJ.',
      iframe: 'jogos/jogoMuseuOuro/index.html',
    },
  ];

  // ALTERAR IMAGEM DO JOGO MUSEU DO OURO
  // ALTERAR IMAGEM DO JOGO MUSEU DO OURO
  // ALTERAR IMAGEM DO JOGO MUSEU DO OURO
  // FAZER DESCRICAO PARA OS 2 JOGOS
  // FAZER DESCRICAO PARA OS 2 JOGOS
  // FAZER DESCRICAO PARA OS 2 JOGOS


  // Quando o usuário escolhe um jogo → mostrar iframe
  if (jogoSelecionado) {
    const jogo = jogos.find((j) => j.id === jogoSelecionado);
    return (
      <div className="w-full h-screen flex flex-col bg-black">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          onClick={() => setJogoSelecionado(null)}
          className="bg-white text-black px-6 py-2 m-4 rounded-xl font-semibold shadow hover:bg-gray-200 transition"
        >
          ⬅ Voltar
        </button>

        <iframe
          src={jogo?.iframe}
          className="w-full h-full border-none rounded-t-2xl"
          title={jogo?.nome}
        />
      </div>
    );
  }

  // Página com cards bonitos
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-white to-gray-100">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        🎮 Escolha seu jogo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {jogos.map((jogo) => (
          <div
            key={jogo.id}
            className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-3xl p-6 flex flex-col items-center text-center border border-gray-100"
          >
            <div className="w-full h-60 overflow-hidden rounded-2xl shadow-md">
              <img
                src={jogo.img}
                alt={jogo.nome}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h2 className="text-3xl font-bold mt-5">{jogo.nome}</h2>

            <p className="text-gray-600 text-lg mt-2 mb-6 px-4">
              {jogo.descricao}
            </p>

            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={() => setJogoSelecionado(jogo.id)}
              className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              Jogar agora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
