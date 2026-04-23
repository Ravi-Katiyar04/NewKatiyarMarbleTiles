// const About = () => {
//   return (
//     <div className="my-14">
//       <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
//         About
//       </p>
//       <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-gray-900">
//         Our heritage & craftsmanship
//       </h1>
//       <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>

//       <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 md:p-10 text-gray-600 leading-relaxed">
//         <p>
//           This website is modeled after premium stone brands like{" "}
//           <a className="underline" href="https://rmsmarbles.com/" target="_blank" rel="noreferrer">
//             RMS Marbles
//           </a>
//           . Add your real company story, yard location, sourcing process, and
//           project credentials here.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default About;

const About = () => {
  return (
    <div className="my-14 max-w-6xl mx-auto px-4">
      {/* Header */}
      <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
        About Us
      </p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-gray-900">
        Crafting Stone. Building Legacy.
      </h1>
      <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>

      {/* Intro Section */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 md:p-10 text-gray-600 leading-relaxed">
        <p className="text-lg">
          Our company is committed to delivering premium-quality natural stones that
          reflect timeless elegance and lasting durability. Every slab we offer is
          carefully selected to meet the highest standards of aesthetics and strength.
        </p>

        <p className="mt-4">
          With deep expertise in sourcing, processing, and supplying marble and stone
          products, we serve a wide range of architectural and interior design needs.
          From refined residential spaces to large-scale commercial projects, our
          materials are chosen for their consistency, finish, and enduring appeal.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
          <p className="mt-3 text-gray-600">
            To provide high-quality natural stones with unmatched craftsmanship,
            ensuring customer satisfaction through reliability, transparency,
            and innovation.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Our Vision</h2>
          <p className="mt-3 text-gray-600">
            To become a trusted name in the global stone industry by consistently
            delivering excellence and setting new standards in quality and
            design.
          </p>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-6 text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-800">Premium Sourcing</h3>
            <p className="mt-2 text-sm">
              Carefully selected stones from the finest quarries to ensure
              superior quality and finish.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">Expert Craftsmanship</h3>
            <p className="mt-2 text-sm">
              Advanced processing techniques combined with skilled workmanship
              for precision and durability.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">Customer Commitment</h3>
            <p className="mt-2 text-sm">
              Dedicated support and tailored solutions for every project, big or
              small.
            </p>
          </div>
        </div>
      </div>

      {/* Closing Section */}
      <div className="mt-10 text-center text-gray-600 max-w-3xl mx-auto">
        <p>
          Whether you're designing a modern space or restoring timeless
          architecture, we are here to provide materials that stand the test of
          time.
        </p>
      </div>
    </div>
  );
};

export default About;

