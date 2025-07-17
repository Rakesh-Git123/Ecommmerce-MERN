import React, { useContext, useEffect } from "react";
import { CartContext } from "../Context/CartContext";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateCartItem, fetchCart, loading, removeFromCart } = useContext(CartContext);
  const items = cart?.items || [];
  const navigate=useNavigate()

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">Your Cart</h2>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-md rounded-xl p-4 gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="ml-4 w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4 sm:mb-0"></div>
              <div className="w-40 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, index) => {
                const product = item.productId;
                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-md rounded-xl p-4 gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">₹ {product.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-end">
                      <button
                        className={`w-8 h-8 ${
                          loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
                        } text-lg rounded`}
                        onClick={() =>
                          !loading &&
                          updateCartItem({
                            productId: product._id,
                            action: "decrement",
                          })
                        }
                        disabled={loading}
                      >
                        -
                      </button>

                      <span className="px-3">{item.quantity}</span>

                      <button
                        className={`w-8 h-8 ${
                          loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
                        } text-lg rounded`}
                        onClick={() =>
                          !loading &&
                          updateCartItem({
                            productId: product._id,
                            action: "increment",
                          })
                        }
                        disabled={loading}
                      >
                        +
                      </button>

                      <button
                        className={`ml-4 px-3 py-1 ${
                          loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                        } text-white rounded`}
                        disabled={loading}
                        onClick={() => removeFromCart(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-xl font-semibold mb-4 sm:mb-0">
                Total: ₹{" "}
                {items.reduce((total, item) => {
                  const product = item.productId;
                  return total + product.price * item.quantity;
                }, 0)}
              </h3>

              <button
                className={`${
                  loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } text-white px-6 py-2 rounded-lg text-sm transition`}
                disabled={loading}
                onClick={()=>navigate("/place-order")}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
