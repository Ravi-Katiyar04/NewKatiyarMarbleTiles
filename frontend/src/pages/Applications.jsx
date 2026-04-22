import { NavLink } from "react-router-dom";

const Applications = () => {
  const apps = [
    { title: "Marble for Flooring", to: "/applications/flooring" },
    { title: "Marble for Wall", to: "/applications/wall" },
    { title: "Marble for Kitchen", to: "/applications/kitchen" },
    { title: "Marble for Stairs", to: "/applications/stairs" },
    { title: "Marble for Living Room", to: "/applications/living" },
    { title: "Marble for Bedroom", to: "/applications/bedroom" },
    { title: "Marble for Bathroom", to: "/applications/bathroom" },
  ];

  return (
    <div className="my-14">
      <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
        Applications
      </p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-gray-900">
        Envision your space
      </h1>
      <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((a) => (
          <NavLink
            key={a.title}
            to={a.to}
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-sm transition"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              View gallery
            </p>
            <p className="mt-3 text-xl font-semibold text-gray-900">
              {a.title}
            </p>
            <p className="mt-5 text-xs tracking-[0.2em] uppercase text-gray-900">
              Explore →
            </p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Applications;

