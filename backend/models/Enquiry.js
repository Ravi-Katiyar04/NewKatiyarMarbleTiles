import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    requirement: { type: String, required: true, trim: true },
    status: { type: String, default: "new" },
    response: {
      message: { type: String, trim: true, default: "" },
      respondedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);

export default Enquiry;

