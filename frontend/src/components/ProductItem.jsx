import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { assets } from '../assets/assets'

const ProductItem = ({id,image,name,price}) => {
    
    const {currency} = useContext(ShopContext);

  return (
<div className='relative text-gray-700 cursor-pointer shadow-lg rounded-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shadow-black/40 px-4 mb-5 group h-auto'>
  {/* Container with Tilt Effect */}
  <div className='overflow-hidden gap-4'>
    <div className='overflow-hidden rounded-lg transform hover:rotate-3d hover:scale-105 transition-all duration-300 ease-in-out'>
      {/* Image with Zoom Effect */}
      <div className="relative w-full aspect-w-16 aspect-h-9">
      <img
        className='w-full h-64 object-contain rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-110'
        src={image[0]}
        alt={name}
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50 transition-opacity duration-300'></div>
    </div>
    </div>
    {/* Product Info */}
    <div className='pt-4 pb-2'>
      <p className='text-lg font-bold text-gray-800 transition-all duration-300 hover:text-orange-500 hover:scale-100'>{name}</p>
      {/* Animated Price with Hover Effect */}
      <p className='text-xl font-semibold text-gray-900 py-2 transform transition-all duration-300 hover:text-orange-500 hover:scale-100'>{currency}{price}</p>

      <Link className='flex items-center justify-center w-full bg-orange-500 text-white py-2 pr-2 rounded-md transform transition-all duration-300 ease-in-out hover:bg-orange-600'  to={`/product/${id}`}>
        <img
          src={assets.view} // Replace with your cart icon path
          alt='View Product'
          className='h-6 mr-[0.55rem]' // Adjust size as needed
        />
        View Product
      </Link>
    </div>
  </div>
</div>


  )
}

export default ProductItem
