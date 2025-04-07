import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Title from '../components/Title';
import CartTotal from '../components/CartTotalCoupon';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import WhatsAppButton from '../components/whatsappbutton';
import 'react-phone-number-input/style.css'
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input'
const PlaceOrder = () => {
    const navigate = useNavigate(); // Initialize navigate

    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
        'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
        'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
        'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    const [method, setMethod] = useState(''); // No default at first
    const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

    const [value, setValue] = useState()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'India', // Set country to India by default
        phone: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    const [availablePaymentMethods, setAvailablePaymentMethods] = useState({
        razorpayAvailable: false,
        codAvailable: false
    });
    
    useEffect(() => {
        const getAvailablePaymentMethods = async () => {
          let razorpayAvailable = false;
          let codAvailable = false;
    
          for (const items in cartItems) {
            for (const item in cartItems[items]) {
              if (cartItems[items][item] > 0) {
                const product = products.find(product => product._id === items);
                if (product && product.paymentMethod) {
                  if (product.paymentMethod.includes('Razorpay')) {
                    razorpayAvailable = true;
                  }
                  if (product.paymentMethod.includes('COD')) {
                    razorpayAvailable = true;
                    codAvailable = true;
                  }
                }
              }
            }
          }
    
          setAvailablePaymentMethods({ razorpayAvailable, codAvailable });
          console.log('Available Payment Methods:', { razorpayAvailable, codAvailable });
    
          // Set default method based on availability
          if (razorpayAvailable) {
            setMethod('razorpay'); // Default to Razorpay if available
          } else if (codAvailable) {
            setMethod('cod'); // Default to COD if only COD is available
          }
        };
    
        getAvailablePaymentMethods();
      }, [cartItems, products]);
    
      const handleRazorpayClick = () => {
        if (availablePaymentMethods.razorpayAvailable) {
          setMethod('razorpay');
        }
      };
    
      const handleCODClick = () => {
        if (availablePaymentMethods.codAvailable) {
          setMethod('cod');
        }
      };

    // Check if the cart is empty and redirect to Cart page
    useEffect(() => {
        if (Object.keys(cartItems).length === 0) {
            navigate('/cart'); // Redirect to cart page if cart is empty
        }
    }, [cartItems, navigate]);

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    }
                } catch (error) {
                    toast.error(error)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            };

            switch (method) {
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                // case 'stripe':
                //     const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
                //     if (responseStripe.data.success) {
                //         const { session_url } = responseStripe.data
                //         window.location.replace(session_url)
                //     } else {
                //         toast.error(responseStripe.data.message)
                //     }
                //     break;

                case 'razorpay':
                    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order)
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px] px-6 ml-6'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <select required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full'>
                        <option value="" disabled>Select State</option>
                        {indianStates.map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input disabled value="India" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <PhoneInput
                    international={false}
                    countryCallingCodeEditable={false}
                    defaultCountry="IN"
                    value={value}
                    onChange={setValue}
                />
            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='mt-8 px-6'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        {/* Razorpay Button */}
                        <div onClick={handleRazorpayClick} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${!availablePaymentMethods.razorpayAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                        </div>

                        {/* COD Button */}
                        <div onClick={handleCODClick} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${availablePaymentMethods.razorpayAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='inline-flex flex-col gap-4 w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm rounded-sm'>PLACE ORDER</button>
                        <WhatsAppButton />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PlaceOrder;
