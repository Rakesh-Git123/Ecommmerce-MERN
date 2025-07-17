import React, { useContext, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { CartContext } from '../Context/CartContext';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const UserNavbar = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const { user, checkAuth } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    setCart([]);
    checkAuth();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md p-3 sm:p-4 px-4 sm:px-6 flex justify-between items-center relative">

      <div 
        className="text-xl sm:text-2xl font-bold text-indigo-600 cursor-pointer" 
        onClick={() => navigate("/")}
      >
        ShopVerse
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
      
        <div 
          className="relative cursor-pointer" 
          onClick={() => navigate("/cart")}
          aria-label="Shopping Cart"
        >
          <FiShoppingCart className="text-xl sm:text-2xl text-gray-700" />
          {cart?.items?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.items.length}
            </span>
          )}
        </div>

        {token ? (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none"
              aria-label="User Menu"
            >
              <FaUserCircle className="text-2xl sm:text-3xl text-gray-700 hover:text-indigo-600" />
            </button>

            {dropdownOpen && (
              <>

                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/order"
                    className="block px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm sm:text-base text-red-600 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (

          <>
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;