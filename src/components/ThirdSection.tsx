"use client";

export default function ThirdSection() {
  return (
    <section className="relative h-screen bg-cover bg-center bg-[url('/imgs/bg3-edit.png')] flex items-center justify-center px-4">
      {/* Caixa flutuante */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 max-w-xl text-center flex flex-col items-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-worksans  text-primary-foreground font-bold">
          Quer conhecer nosso museu?
        </h2>

        <p className="text-2xl md:text-3xl font-worksans text-primary-foreground">
          Temos um tour 3D interativo por todo nosso museu! Que tal experimentar?
        </p>

        <a href="/tour">
          <button className="mt-4 bg-accent text-accent-foreground px-8 py-4 md:px-12 md:py-5 rounded-xl text-lg md:text-2xl font-semibold hover:bg-red-950 transition duration-300 shadow-md">
            Faça um tour!
          </button>
        </a>
      </div>
    </section>
  );
}
