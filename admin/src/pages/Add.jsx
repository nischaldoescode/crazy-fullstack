import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Showwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [showSizeOptions, setShowSizeOptions] = useState(true);

  // Coupon and Discount
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountOption, setDiscountOption] = useState(0); // Discount option from dropdown (5%-20%)

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  // Hide size options for watches and set default size
  useEffect(() => {
    const isWatch = subCategory === "Handwear";
    setShowSizeOptions(!isWatch);
    if (isWatch) {
      setSizes(["one-size"]);
    } else {
      setSizes([]);
    }
  }, [subCategory]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    // Validate sizes for non-watch products
    if (subCategory !== "Handwear" && sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("couponCode", couponCode); // Send coupon code
      formData.append("discountOption", discountOption); // Send discount
      formData.append("paymentMethod", paymentMethod); // Send payment method
  
      // Log FormData entries to the console
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      // Append images if any
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);
  
      // Send the FormData to the server
      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });
  
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setBestseller(false);
    setCategory("Men");
    setSubCategory("Showwear");
    setSizes([]);
    setCouponCode("");
    setDiscount(0);
    setDiscountOption(0); // Reset dropdown discount option
    setPaymentMethod("Razorpay");
  };

  const toggleSize = (size) => {
    setSizes(prev =>
      prev.includes(size)
        ? prev.filter(item => item !== size)
        : [...prev, size]
    );
  };

  // Handle coupon code change and update discount
  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);

    // Example logic to simulate discount for the code
    if (e.target.value === "SAVE10") {
      setDiscount(10); // 10% discount for SAVE10
    } else if (e.target.value === "SAVE15") {
      setDiscount(15); // 15% discount for SAVE15
    } else if (e.target.value === "SAVE20") {
      setDiscount(20); // 20% discount for SAVE20
    } else {
      setDiscount(0); // Reset if no valid coupon
    }
  };

  // Handle discount selection change from the dropdown
  const handleDiscountChange = (e) => {
    setDiscountOption(parseInt(e.target.value, 10)); // Set selected discount from dropdown
    setDiscount(0); // Reset coupon discount when dropdown is used
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[1, 2, 3, 4].map((num) => (
            <label key={num} htmlFor={`image${num}`}>
              <img
                className='w-20'
                src={!eval(`image${num}`) ? assets.upload_area : URL.createObjectURL(eval(`image${num}`))}
                alt=""
              />
              <input
                onChange={(e) => eval(`setImage${num}`)(e.target.files[0])}
                type="file"
                id={`image${num}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='w-full max-w-[500px] px-3 py-2'
          type="text"
          placeholder='Type here'
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='w-full max-w-[500px] px-3 py-2'
          placeholder='Write content here'
          required
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className='w-full px-3 py-2'
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className='w-full px-3 py-2'
          >
            <option value="Showwear">Shoes</option>
            <option value="Handwear">Watches</option>
            <option value="Winterwear">T-shirts</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className='w-full px-3 py-2 sm:w-[120px]'
            type="Number"
            placeholder='25'
            min="0"
            required
          />
        </div>
      </div>

      {/* Coupon Code and Discount Selection */}
      <div className="mt-4">
        <p className='mb-2'>Coupon Code</p>
        <input
          type="text"
          value={couponCode}
          onChange={handleCouponChange}
          className="w-full px-3 py-2"
          placeholder="Enter Coupon Code"
        />
        <p className="text-sm text-gray-500 mt-2">Discount: {discount}%</p>
      </div>

      <div className="mt-4">
        <p className="mb-2">Or Select Discount</p>
        <select
          onChange={handleDiscountChange}
          value={discountOption}
          className="w-full px-3 py-2"
        >
          <option value="0">No Discount</option>
          <option value="5">5% Discount</option>
          <option value="10">10% Discount</option>
          <option value="15">15% Discount</option>
          <option value="20">20% Discount</option>
        </select>
      </div>

      {/* Payment Method and Product Sizes */}
      <div className="mt-4">
        <p className="mb-2">Payment Method</p>
        <select
  onChange={(e) => setPaymentMethod(e.target.value)}
  value={paymentMethod}
  className="w-full px-3 py-2"
>
  <option value="Razorpay">Razorpay</option>
  <option value="COD">Cash on Delivery</option>
</select>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        {showSizeOptions ? (
          <div className='flex gap-3'>
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() => toggleSize(size)}
              >
                <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>
                  {size}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500'>
            Watches use default "one-size" - no selection needed
          </p>
        )}
      </div>

      <div className='flex gap-2 mt-2'>
        <input
          onChange={() => setBestseller(prev => !prev)}
          checked={bestseller}
          type="checkbox"
          id='bestseller'
        />
        <label className='cursor-pointer' htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button
        type="submit"
        className='w-28 py-3 mt-4 bg-black text-white hover:bg-gray-800 transition-colors'
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
