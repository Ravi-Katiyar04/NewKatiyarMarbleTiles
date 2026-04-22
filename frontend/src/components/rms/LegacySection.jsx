const LegacySection = () => {
  return (
    <section className="mt-16">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
          India’s most trusted brand
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-gray-900">
          Where every slab tells a story of excellence
        </h2>
        <p className="mt-4 text-gray-600 max-w-3xl">
          We supply premium marble, granite, tiles and sanitaryware for luxury
          homes and large commercial projects. Expect authenticity, consistent
          quality, and expert guidance from selection to delivery.
        </p>

        <ul className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <li className="border border-gray-200 rounded-xl p-5">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              Authentic sourcing
            </p>
            <p className="mt-2 font-semibold text-gray-900">
              Direct selection & quality checks
            </p>
          </li>
          <li className="border border-gray-200 rounded-xl p-5">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              Wide variety
            </p>
            <p className="mt-2 font-semibold text-gray-900">
              Exotic slabs, tiles, and finishes
            </p>
          </li>
          <li className="border border-gray-200 rounded-xl p-5">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              Safe logistics
            </p>
            <p className="mt-2 font-semibold text-gray-900">
              Pan‑India delivery with care
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default LegacySection;

