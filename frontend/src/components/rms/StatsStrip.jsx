const StatsStrip = () => {
  const stats = [
    { value: "250+", label: "Exotic Slabs" },
    { value: "20+", label: "Years of Heritage" },
    { value: "1K+", label: "Completed Projects" },
    { value: "#1", label: "Premium Supplier" },
  ];

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-gray-200 bg-white px-6 md:px-10 py-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-semibold text-gray-900">
                {s.value}
              </p>
              <p className="mt-1 text-xs tracking-[0.28em] uppercase text-gray-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;

