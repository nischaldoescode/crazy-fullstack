import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import "./Cart.css";


const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Function to handle cart data display
  const renderCartItems = () => {
    return cartData.map((item, index) => {
      const productData = products.find((product) => product._id === item._id);

      return (
        <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
          <div className='flex items-start gap-6'>
            <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
            <div>
              <p className='text-2xl sm:text-lg font-bold px-2 mt-1'>{productData.name}</p>
              <div className='flex items-center gap-5 mt-2'>
                <p className='px-2 text-xl'>{currency}{productData.price}</p>
                <p className='px-3 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
              </div>
            </div>
          </div>

          {/* Quantity control */}
          <div className="flex items-center">
            <button
              onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.size, item.quantity - 1) : null}
              className="border px-2 py-1 hover:bg-gray-200"
            >
              -
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const value = e.target.value === '' || e.target.value === '0' ? 1 : Number(e.target.value);
                updateQuantity(item._id, item.size, value);
              }}
              className="border max-w-10 sm:max-w-9 px-1 sm:px-2 py-1 text-center hover:bg-gray-200"
              min={1}
            />
            <button
              onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
              className="border px-2 py-1 hover:bg-gray-200"
            >
              +
            </button>
          </div>

          {/* Remove item */}
          <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-5 mr-4 sm:w-6 cursor-pointer' src={assets.bin_icon} alt="" />
        </div>
      );
    });
  };

  return (
    <div className='border-t pt-14 px-7'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {/* Display a message if cart is empty */}
      {cartData.length === 0 ? (
        <div className="text-center text-xl text-gray-600">
          Your cart is empty :(
        </div>
      ) : (
        <div>
          {renderCartItems()}
        </div>
      )}

      {/* Display Cart Total and Checkout Button only when cart has items */}
      {cartData.length > 0 && (
        <div className='flex justify-end my-20'>
          <div className='w-full sm:w-[450px] px-4'>
            <CartTotal />
            <div className='flex justify-end '>
              
              <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm mt-6 px-4 py-3 rounded-md hover:bg-black-400 hover:scale-105 transition ease-in-out duration-200'>
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
