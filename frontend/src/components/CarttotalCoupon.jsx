import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import axios from 'axios'; // Import axios for making HTTP requests
import { toast } from 'react-toastify'; // Import toast for notifications

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount, backendUrl, token } = useContext(ShopContext);

    const [couponCode, setCouponCode] = useState(''); // To store the coupon code
    const [discountAmount, setDiscountAmount] = useState(0); // To store the discount amount in numeric form
    const [couponApplied, setCouponApplied] = useState(false); // Track whether the coupon is applied or not

    // Apply Coupon Logic
    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            // If the coupon code is empty, show an error message
            toast.error('Please enter a coupon code.');
            return; // Stop execution if the coupon code is empty
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/product/validate-coupon`,  // Correct URL for coupon validation
                { couponCode },  // Send coupon code to backend
                {
                    headers: {
                        'Content-Type': 'application/json',  // Set the proper content type for the request
                        'token': token // Send token for authentication (if needed)
                    }
                }
            );

            if (response.data.success) {
                // If coupon is valid, apply discount
                const discount = response.data.coupon.discountOption; // Get the discount percentage
                const discountValue = (getCartAmount() + delivery_fee) * (discount / 100);
                setDiscountAmount(discountValue);
                setCouponApplied(true);
                toast.success(`Coupon Applied: -${currency} ${discountValue.toFixed(2)}`); // Show success toast
            } else {
                setDiscountAmount(0);  // Reset discount if coupon is invalid
                setCouponApplied(false);
                toast.error('Invalid Coupon Code');  // Show error toast
            }
        } catch (error) {
            setDiscountAmount(0);  // Reset discount on error
            setCouponApplied(false);
            toast.error('An error occurred while applying the coupon');  // Show error toast for network or other errors
        }
    };

    // Remove Coupon Logic
    const removeCoupon = () => {
        setCouponApplied(false); // Reset coupon applied state
        setDiscountAmount(0); // Reset the discount amount
        setCouponCode(''); // Clear the coupon code input
        toast.info('Coupon removed'); // Show toast that coupon was removed
    };

    // Calculate the total amount after applying coupon
    const totalAmount = (getCartAmount() + delivery_fee) - discountAmount;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'TOTALS'} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency} {getCartAmount()}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency} {delivery_fee}.00</p>
                </div>
                <hr />

                {/* Add Coupon Code Input */}
                {!couponApplied && ( // Only show input if no coupon has been applied
                    <div className='flex justify-between'>
                        <input
                            type="text"
                            placeholder="Enter Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        />
                        <button
                            type="button"
                            onClick={applyCoupon}
                            className="ml-3 text-blue-600 mt-2"
                            disabled={couponApplied} // Disable the button if coupon is already applied
                        >
                            Apply Coupon
                        </button>
                    </div>
                )}
                <hr />

                {/* Show Discounted Total */}
                {couponApplied && (
                    <div className='flex justify-between'>
                        <p className="text-green-500">Discount Applied</p>
                        <p className="text-green-500">- {currency} {discountAmount.toFixed(2)}
                            <button
                                type="button"
                                onClick={removeCoupon}
                                className="text-red-500 ml-3"
                            >
                                X {/* Cancel button */}
                            </button>
                        </p>
                    </div>
                )}
                <hr />
                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>{currency} {totalAmount === 0 ? 0 : totalAmount.toFixed(2)}</b>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
