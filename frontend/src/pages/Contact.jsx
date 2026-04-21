import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill all fields.");
      return;
    }

    // No backend endpoint exists yet; keep it as a friendly local form.
    toast.success("Thanks! We’ll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Contact us
        </h1>
        <p className="mt-2 text-gray-600">
          Have a question about an availability, Quality, or price? Send us a message
          and we’ll respond as soon as possible.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="p-5 rounded-xl border border-gray-200 bg-white">
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                new_katiyar_marble_tiles@gmail.com
              </p>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 bg-white">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="mt-1 font-medium text-gray-800">+91 8445273731</p>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 bg-white">
              <p className="text-sm text-gray-500">Hours</p>
              <p className="mt-1 font-medium text-gray-800">
                Mon–Sat, 8:00 AM – 7:00 PM
              </p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-2 p-6 rounded-xl border border-gray-200 bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Your name"
                  type="text"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                className="mt-1 w-full min-h-[130px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              className="mt-5 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-lg font-medium"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

