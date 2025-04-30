const Exposicao = () => {
  return (
    <div className=" m-auto min-h-screen flex flex-col items-center">
      <section className="w-full p-4">
        <h2 className="text-2xl font-bold mb-4">Exposição</h2>
        <iframe
          src="/exposicoes/three"
          width="1200px"
          height="1200px"
          title={'Exposição'}
        />
      </section>
    </div>
  );
};

export default Exposicao;
