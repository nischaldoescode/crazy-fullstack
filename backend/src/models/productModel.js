import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    bestseller: { type: Boolean, default: false },
    sizes: { type: [String], default: [] },
    image: { type: [String], required: true }, // Array of image URLs
    couponCode: { type: String, required: false }, // New field
    discount: { type: Number, default: 0 }, // New field
    paymentMethod: { type: String, required: true }, // Array for multiple payment methods
    date: { type: Date, default: Date.now }
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
