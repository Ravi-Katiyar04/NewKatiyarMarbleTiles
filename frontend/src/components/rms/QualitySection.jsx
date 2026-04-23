const QualitySection = () => {
  const items = [
    {
      no: "01",
      title: "Direct sourcing",
      desc: "No middlemen — handpicked slabs and consistent quality checks.",
    },
    {
      no: "02",
      title: "Wide variety",
      desc: "Multiple finishes and premium selections for every space.",
    },
    {
      no: "03",
      title: "Pan‑India logistics",
      desc: "Safe packaging, insured delivery, and on-time dispatch.",
    },
    {
      no: "04",
      title: "Expert support",
      desc: "Guidance for selection, estimation, installation & care.",
    },
  ];

  return (
    <section className="mt-16">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
          The standard
        </p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-gray-900">
          Uncompromising quality
        </h2>
        <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((i) => (
            <div key={i.no} className="flex gap-4 rounded-xl border border-gray-200 p-5">
              <div className="font-display text-2xl font-semibold text-gray-900 w-12">
                {i.no}.
              </div>
              <div>
                <p className="font-semibold text-gray-900">{i.title}</p>
                <p className="mt-1 text-sm text-gray-600">{i.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualitySection;

