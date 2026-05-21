import Enquiry from "../models/Enquiry.js";
import jwt from "jsonwebtoken";
import { createNotification } from "../utils/createNotification.js";

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

export const getUserEnquiryById = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const enquiry = await Enquiry.findOne({ _id: id, userId });
    if (!enquiry) {
      return res.json({ success: false, message: "Enquiry not found." });
    }

    return res.json({ success: true, enquiry });
  } catch (error) {
    console.error("Error fetching enquiry:", error.message);
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

    if (!message) {
      return res.json({ success: false, message: "Response message is required." });
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) return res.json({ success: false, message: "Enquiry not found." });

    if (enquiry.userId) {
      await createNotification({
        userId: enquiry.userId,
        type: "enquiry_reply",
        title: "Reply to your enquiry",
        message: `Requirement: ${enquiry.requirement}\n\nReply: ${message}`,
        refId: enquiry._id,
        refType: "enquiry",
        meta: {
          name: enquiry.name,
          phone: enquiry.phone,
          requirement: enquiry.requirement,
          reply: message,
        },
      });
    }

    await Enquiry.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Reply sent. Enquiry removed from database.",
    });
  } catch (error) {
    console.error("Error responding to enquiry:", error.message);
    return res.json({ success: false, message: error.message });
  }
};
