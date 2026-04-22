import { useAppCOntext } from "../../context/AppContext";

const QuoteSection = () => {
  const { setShowEnquiry } = useAppCOntext();

  return (
    <section className="mt-16 mb-6">
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              Final step
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-gray-900">
              Let’s begin your masterpiece
            </h2>
            <p className="mt-4 text-gray-600">
              Consult directly with our specialists. Bookings are supported via Stripe deposit payment in your cart flow.
            </p>

            <ul className="mt-6 text-sm text-gray-700 space-y-2">
              <li>Premium quality — authentic materials</li>
              <li>Safe & insured delivery</li>
              <li>Transparent pricing & dedicated support</li>
            </ul>

            <button
              onClick={() => setShowEnquiry(true)}
              className="mt-8 h-12 px-8 bg-gray-900 hover:bg-black transition text-white text-xs tracking-[0.2em] uppercase font-semibold"
            >
              Request a Quote
            </button>
          </div>

          <div className="bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-8 md:p-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              Contact
            </p>
            <p className="mt-3 text-sm text-gray-700">
              Direct WhatsApp Integration (optional)
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-gray-500 text-xs tracking-[0.2em] uppercase">WhatsApp</p>
                <p className="mt-1 font-semibold text-gray-900">+91 8445273731</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-gray-500 text-xs tracking-[0.2em] uppercase">Email</p>
                <p className="mt-1 font-semibold text-gray-900">new_katiyar_marble_tiles@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;

