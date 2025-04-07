import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = ({ setUser }) => {

  const [visible, setVisible] = useState(false);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, userProfile, userName } = useContext(ShopContext);

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('userInformation')
    setUser(null)
    setCartItems({})
  }

  const user = localStorage.getItem('userInformation')

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';  // Disable scrolling
    } else {
      document.body.style.overflow = 'auto';   // Enable scrolling
    }

    // Cleanup: when component unmounts or sidebar is closed
    return () => {
      document.body.style.overflow = 'auto';   // Restore scrolling
    };
  }, [visible]);
  return (
    <div className='flex items-center justify-between py-5 sm:px-[2vw] lg:px-[5vw] font-medium'>

      <Link to='/'><img src={assets.logo} className='w-[13em]' alt="" /></Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

      </ul>

      <div className='flex items-center gap-5 lg:gap-[2rem]'>
        <img onClick={() => { setShowSearch(true); navigate('/collection') }} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

        <div className="group relative" onClick={() => navigate('/login')} >
          {/* If logged in, show the default user icon */}
          {user ? (
            <img src="/Images/profileIcon.jpg" className="w-10 h-10 rounded-full hover:transform scale-75 cursor-pointer object-contain" alt="User Icon" />
          ) : (
            <img src="/Images/userIcon.jpg" className="w-10 h-10 rounded-full hover:transform scale-75 cursor-pointer object-cover" alt="Profile Icon" />
          )}


          {/* Dropdown Menu */}
          {user && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-5 z-20">
              <div className="flex flex-col gap-2 w-36 py-4 px-6 bg-slate-100 text-gray-500 rounded">
                <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black text-lg">Orders</p>
                <p onClick={logout} className="cursor-pointer hover:text-black">{user && 'Logout'} </p>
              </div>
            </div>
          )}
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>
        <div className='flex sm:hidden cursor-pointer items-center gap-2 mr-[0.75rem]'>
          <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-6 cursor-pointer sm:hidden' alt="" />
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-screen overflow-hidden bg-white transition-all z-20 ${visible ? 'w-full' : 'w-0'}`}
      >
        <div className='flex flex-col h-full text-gray-600 overflow-hidden'> {/* Ensure this takes full height */}
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
        </div>
      </div>

    </div>
  )
}

export default Navbar
