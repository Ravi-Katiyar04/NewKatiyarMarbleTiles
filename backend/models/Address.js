import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {

        type: String,
        required: true,
    },
    zipcode: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },

});   

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);
export default Address;