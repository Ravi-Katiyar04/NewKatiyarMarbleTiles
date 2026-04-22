import express from "express";
import { createEnquiry, getAllEnquiries, getUserEnquiries, respondToEnquiry } from "../controllers/enquiryController.js";
import authSeller from "../middlewares/authSeller.js";
import authUser from "../middlewares/authUser.js";

const enquiryRouter = express.Router();

// Public: create an enquiry from "Get a Quote"
enquiryRouter.post("/", createEnquiry);

// User: view own enquiries (and responses)
enquiryRouter.get("/user", authUser, getUserEnquiries);

// Seller/admin: view all enquiries
enquiryRouter.get("/seller", authSeller, getAllEnquiries);

// Seller/admin: respond to an enquiry
enquiryRouter.put("/:id/respond", authSeller, respondToEnquiry);

export default enquiryRouter;

