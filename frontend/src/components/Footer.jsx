import React, { useContext } from 'react'
import { ProductContext } from '../Context/ProductContext'

const Footer = () => {
    const {fetchProducts} = useContext(ProductContext);
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 md:py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="w-full">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">ShopVerse</h2>
            <p className="text-xs sm:text-sm">
              Your premium destination for electronics, fashion, home goods and more.
            </p>
          </div>

         
          <div className="w-full">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2 text-xs sm:text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/products" className="hover:text-white transition">Products</a></li>
              <li><a href="/cart" className="hover:text-white transition">Cart</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

        
          <div className="w-full">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Categories</h3>
            <ul className="space-y-1 md:space-y-2 text-xs sm:text-sm">
              <li 
                onClick={()=>fetchProducts({category:"clothes"})} 
                className="hover:text-white transition cursor-pointer"
              >
                Clothes
              </li>
              <li 
                onClick={()=>fetchProducts({category:"electronics"})} 
                className="hover:text-white transition cursor-pointer"
              >
                Electronics
              </li>
              <li 
                onClick={()=>fetchProducts({category:"grocery"})} 
                className="hover:text-white transition cursor-pointer"
              >
                Grocery
              </li>
            </ul>
          </div>

          
          <div className="w-full">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Connect</h3>
            <ul className="space-y-1 md:space-y-2 text-xs sm:text-sm">
              <li>Email: <a href="mailto:support@shopverse.com" className="text-indigo-400 hover:underline">support@shopverse.com</a></li>
              <li>Phone: <span className="text-indigo-400">+91 9876543210</span></li>
              <li className="flex space-x-3 md:space-x-4 mt-1 md:mt-2">
                <a href="#" className="hover:text-white text-sm md:text-base"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="hover:text-white text-sm md:text-base"><i className="fab fa-twitter"></i></a>
                <a href="#" className="hover:text-white text-sm md:text-base"><i className="fab fa-instagram"></i></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-10 border-t border-gray-700 pt-4 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} ShopVerse. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer