// import React, { useEffect, useState } from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import Home from './pages/Home'
// import Collection from './pages/Collection'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import Product from './pages/Product'
// import Cart from './pages/Cart'
// import PlaceOrder from './pages/PlaceOrder'
// import Orders from './pages/Orders'
// import Navbar from './components/Navbar'
// import Footer from './components/Footer'
// import SearchBar from './components/SearchBar'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Verify from './pages/Verify'
// import Register from './pages/Register'
// import Login from './pages/Login'


// const App = () => {

//   const [user, setUser] = useState(null)

//   useEffect(() => {

//     const storedUser = localStorage.getItem("userInformation") ? JSON.parse(localStorage.getItem("userInformation")) : null;
//     if (storedUser) {
//       setUser(storedUser)
//     }
//   }, [])

//   console.log(user)

//   return (
//     <div className='px-0 sm:px-[1vw] md:px-[1vw] lg:px-[0vw] w-screen'>
//       <ToastContainer />
//       <Navbar />
//       <SearchBar />
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/collection' element={<Collection />} />
//         <Route path='/about' element={<About />} />
//         <Route path='/contact' element={<Contact />} />
//         <Route path='/product/:productId' element={<Product />} />
//         {/* <Route path='/cart' element={<Cart />} /> */}
//         <Route path='/register' element={<Register />} />
//         <Route path='/login' element={<Login setUser={setUser} user={user} />} />
//         <Route path='/place-order' element={user ? <PlaceOrder /> : <Navigate to="/login" />} />
//         <Route path='/orders' element={<Orders />} />
//         <Route path='/verify' element={<Verify />} />

//       </Routes>
//       <Footer />
//     </div>
//   )
// }

// export default App




import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom' // 👈 also import Navigate
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import Register from './pages/Register'
import Login from './pages/Login'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("userInformation") ? JSON.parse(localStorage.getItem("userInformation")) : null;
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  console.log(user)

  return (
    <div className='px-0 sm:px-[1vw] md:px-[1vw] lg:px-[0vw] w-screen'>
      <ToastContainer />
      <Navbar setUser={setUser} />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/register' element={!user && <Register />} />
        <Route path='/login' element={!user && <Login setUser={setUser} />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/orders' element={<Orders />} />

        {/* ✅ Protected Route */}
        <Route
          path='/place-order'
          element={
            user ? <PlaceOrder /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
