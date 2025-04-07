import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function to add product
const addProduct = async (req, res) => {
  try {
    // Log the entire body and files to debug
    console.log(req.body);  // Check that couponCode and paymentMethod exist in req.body
    console.log(req.files);  // Check that images are present

    const { name, description, price, category, subCategory, sizes, bestseller, couponCode, discountOption, paymentMethod } = req.body;
    console.log("Payment Method:", paymentMethod);

    // Other logic remains the same
    let finalPrice = Number(price);

    if (discountOption > 0) {
      finalPrice = finalPrice - (finalPrice * (discountOption / 100));
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // Construct product data
    const productData = {
      name,
      description,
      category,
      price: finalPrice,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      couponCode,
      discount: discountOption,
      paymentMethod,
      date: Date.now(),
    };

    // Create new product in the database
    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to list products
const listProducts = async (req, res) => {
  try {
    // Fetch all products
    const products = await productModel.find({});

    // List of available payment methods (this can be dynamic or static)
    const paymentMethods = ["Razorpay", "COD"];

    // Send the product data along with available payment methods
    res.json({ success: true, products, paymentMethods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to remove a product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to validate coupon code
const validateCoupon = async (req, res) => {
  try {
      const { couponCode } = req.body;

      // Check if the coupon code exists in your products
      const product = await productModel.findOne({ couponCode });

      if (product) {
          // If coupon code is valid, return the discount value (percentage)
          res.json({
              success: true,
              coupon: {
                  couponCode: product.couponCode,
                  discountOption: product.discount // Assuming it's a percentage discount
              }
          });
      } else {
          // If coupon code is not found, return an error message
          res.json({ success: false, message: "Invalid coupon code!" });
      }
  } catch (error) {
      console.log(error);
      console.error('Coupon validation error:', error);
      res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct, validateCoupon };
