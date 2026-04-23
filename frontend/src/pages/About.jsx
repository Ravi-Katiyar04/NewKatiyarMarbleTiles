const About = () => {
  return (
    <div className="my-14">
      <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
        About
      </p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-gray-900">
        Our heritage & craftsmanship
      </h1>
      <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 md:p-10 text-gray-600 leading-relaxed">
        <p>
          This website is modeled after premium stone brands like{" "}
          <a className="underline" href="https://rmsmarbles.com/" target="_blank" rel="noreferrer">
            RMS Marbles
          </a>
          . Add your real company story, yard location, sourcing process, and
          project credentials here.
        </p>
      </div>
    </div>
  );
};

export default About;

