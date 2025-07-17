import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";
import hero from "../assets/hero.jpg";
import { CartContext } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { ProductContext } from "../Context/ProductContext";

const UserDashboard = () => {
  const { addToCart, cart, fetchCart } = useContext(CartContext);
  const {products,loading,error,fetchProducts}= useContext(ProductContext)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const productSectionRef = useRef(null);
  const navigate = useNavigate();

  const scrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetchProducts({search,category,sortOrder});
  }, [category, search, sortOrder]);

  useEffect(() => {
    if (localStorage.getItem("token")) fetchCart();
  }, []);

  // Handle Category Filter
  const handleCategory = (cat) => {
    setCategory(cat);
  };

  const onClickCart = (productId) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    addToCart({ productId });
  };

  return (
    <div>
      <UserNavbar />
      {/* Hero Section */}
      <section
        className="relative w-full h-[70vh] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80')`,
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-16 h-16 rounded-full bg-white opacity-10 animate-float1"></div>
          <div className="absolute top-1/3 right-32 w-24 h-24 rounded-full bg-indigo-400 opacity-10 animate-float2"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-white opacity-10 animate-float3"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-white max-w-3xl transform transition-all duration-700 hover:scale-105">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fadeInUp">
              Discover Amazing Deals at <br />
              <span className="text-indigo-300 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                ShopVerse
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-gray-100 animate-fadeInUp delay-100">
              Your premium destination for electronics, fashion, home goods and
              more!
            </p>

            <div className="flex gap-4 justify-center animate-fadeInUp delay-200">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30"
                onClick={scrollToProducts}
              >
                Start Shopping
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Scrolling indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </section>

      {/* Category Buttons */}
      <div className="flex justify-center gap-4 mt-8 flex-wrap">
        {["all", "clothes", "electronics", "grocery"].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-2 rounded-full border font-medium transition ${
              category === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <div className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex justify-end">
        <select
          className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Product List */}
      <div
        ref={productSectionRef}
        className="px-4 py-8 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 w-full bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <p className="text-center col-span-full text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center col-span-full">No products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

                <p className="text-gray-600 mb-2">₹ {product.price}</p>
                {product.countInStock > 0 ? (
                  cart?.items?.some(
                    (item) => item?.productId?._id === product?._id
                  ) ? (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-600 py-2 rounded-md cursor-not-allowed"
                    >
                      Already in Cart
                    </button>
                  ) : (
                    <button
                      className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                      onClick={() => onClickCart(product._id)}
                    >
                      Add to Cart
                    </button>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-2 rounded-md cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default UserDashboard;
