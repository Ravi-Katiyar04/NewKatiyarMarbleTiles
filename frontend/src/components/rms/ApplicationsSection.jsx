import { NavLink } from "react-router-dom";

const ApplicationsSection = () => {
  const apps = [
    { title: "Luxury Villas", desc: "Grand flooring & statement spaces", to: "/applications/villas" },
    { title: "Designer Bathrooms", desc: "Water-resistant premium finishes", to: "/applications/bathroom" },
    { title: "Statement Kitchens", desc: "Heat & scratch resistant surfaces", to: "/applications/kitchen" },
    { title: "Grand Staircases", desc: "Seamless treads & risers", to: "/applications/stairs" },
    { title: "Commercial Facades", desc: "Large volumes with slab matching", to: "/applications/commercial" },
  ];

  return (
    <section className="mt-16">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
          Applications
        </p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-gray-900">
          Envision your space
        </h2>
        <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((a) => (
          <NavLink
            key={a.title}
            to={a.to}
            className="group rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              View gallery
            </p>
            <h3 className="mt-3 text-xl font-semibold text-gray-900 group-hover:text-black">
              {a.title}
            </h3>
            <p className="mt-2 text-gray-600 text-sm">{a.desc}</p>
            <div className="mt-5 text-xs tracking-[0.2em] uppercase text-gray-900">
              Explore →
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default ApplicationsSection;

