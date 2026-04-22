import Enquiry from "../models/Enquiry.js";
import jwt from "jsonwebtoken";

export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, requirement } = req.body;

    if (!name?.trim() || !phone?.trim() || !requirement?.trim()) {
      return res.json({ success: false, message: "All fields are required." });
    }

    // If the user is logged in, attach the enquiry to their account.
    let userId = undefined;
    const token = req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.id) userId = decoded.id;
      } catch {
        // ignore invalid token for public enquiry submissions
      }
    }

    const enquiry = await Enquiry.create({
      userId,
      name: name.trim(),
      phone: phone.trim(),
      requirement: requirement.trim(),
    });

    return res.json({ success: true, enquiry });
  } catch (error) {
    console.error("Error creating enquiry:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getUserEnquiries = async (req, res) => {
  try {
    const { userId } = req;
    const enquiries = await Enquiry.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, enquiries });
  } catch (error) {
    console.error("Error fetching user enquiries:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const respondToEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const message = (req.body?.message || "").trim();
    const status = (req.body?.status || "").trim();

    if (!message) {
      return res.json({ success: false, message: "Response message is required." });
    }

    const update = {
      "response.message": message,
      "response.respondedAt": new Date(),
    };
    if (status) update.status = status;
    else update.status = "responded";

    const enquiry = await Enquiry.findByIdAndUpdate(id, update, { new: true });
    if (!enquiry) return res.json({ success: false, message: "Enquiry not found." });
    return res.json({ success: true, enquiry });
  } catch (error) {
    console.error("Error responding to enquiry:", error.message);
    return res.json({ success: false, message: error.message });
  }
};
