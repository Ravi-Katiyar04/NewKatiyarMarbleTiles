import { useMemo, useState } from "react";
import { useAppCOntext } from "../../context/AppContext";
import ProductCard from "../ProductCard";

const GallerySection = () => {
  const { products, navigate } = useAppCOntext();
  const [tab, setTab] = useState("all");

  const tabs = useMemo(
    () => [
      { key: "all", label: "All Stones" },
      { key: "marble", label: "Marble" },
      { key: "granite", label: "Granite" },
      { key: "vitrified_tiles", label: "Vitrified" },
      { key: "ceramic_tiles", label: "Ceramic" },
      { key: "sanitary", label: "Sanitary" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const inStock = products.filter((p) => p?.inStock);
    if (tab === "all") return inStock.slice(0, 8);
    return inStock
      .filter((p) => (p.category || "").toLowerCase() === tab)
      .slice(0, 8);
  }, [products, tab]);

  return (
    <section className="mt-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
            The masterpiece
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-gray-900">
            Gallery
          </h2>
          <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 h-10 border text-xs tracking-[0.2em] uppercase transition ${
                tab === t.key
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 mt-8">
        {filtered.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/products")}
          className="h-12 px-8 border border-gray-900 text-gray-900 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 hover:text-white transition"
        >
          View the complete range
        </button>
      </div>
    </section>
  );
};

export default GallerySection;

