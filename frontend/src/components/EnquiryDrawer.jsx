import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppCOntext } from "../context/AppContext";

const EnquiryDrawer = () => {
  const { showEnquiry, setShowEnquiry, axios } = useAppCOntext();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    requirement: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      form.phone.trim().length >= 8 &&
      form.requirement.trim().length > 2
    );
  }, [form]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowEnquiry(false);
    };

    if (showEnquiry) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showEnquiry, setShowEnquiry]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const { data } = await axios.post("/api/enquiry", form);
      if (data?.success) {
        toast.success("Enquiry sent. We’ll contact you shortly.");
        setForm({ name: "", phone: "", requirement: "" });
        setShowEnquiry(false);
      } else {
        toast.error(data?.message || "Failed to send enquiry.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!showEnquiry) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        aria-label="Close enquiry"
        onClick={() => setShowEnquiry(false)}
        className="absolute inset-0 bg-black/45"
      />

      <aside className="absolute right-0 top-0 h-full w-full sm:max-w-[420px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Enquiry</h3>
          <button
            onClick={() => setShowEnquiry(false)}
            className="text-xs tracking-wider uppercase font-semibold px-3 py-2 bg-teal-500 hover:bg-teal-600 transition text-white"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm text-gray-600">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Mobile No. <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              placeholder="Phone number"
              inputMode="tel"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Requirement (Qty) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="requirement"
              value={form.requirement}
              onChange={onChange}
              className="mt-1 w-full min-h-[120px] border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 resize-none"
              placeholder="Eg. Italian marble for living room, ~800 sq.ft"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 font-semibold tracking-wide uppercase text-sm bg-[#8b1d1d] hover:bg-[#741717] disabled:bg-gray-300 disabled:text-gray-600 transition text-white"
          >
            Send Enquiry
          </button>
        </form>

        <div className="mt-auto border-t border-gray-200 p-5 text-xs text-gray-500">
          By submitting, you agree to be contacted regarding your enquiry.
        </div>
      </aside>
    </div>
  );
};

export default EnquiryDrawer;

