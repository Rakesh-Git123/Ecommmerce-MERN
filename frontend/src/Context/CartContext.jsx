import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://ecommmerce-mern.onrender.com/api/cart", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Fetch cart error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async ({ productId, quantity = 1 }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://ecommmerce-mern.onrender.com/api/cart/add",
        { productId, quantity },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        fetchCart()
        setCart(res.data.cart);
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async ({ productId, action }) => {
    try {
      const res = await axios.put(
        "https://ecommmerce-mern.onrender.com/api/cart/update",
        { productId, action },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
  
      if (res.data.success) {
        fetchCart();
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Update cart item failed:", err.response?.data || err.message);
    }
  };

  const removeFromCart = async (productId) => {
    const id=productId;
    try {
      const res = await axios.delete(`https://ecommmerce-mern.onrender.com/api/cart/remove/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
  
      if (res.data.success) {
        fetchCart()
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Remove from cart failed:", err.response?.data || err.message);
    }
  };

  const clearCart=async() =>{
    try {
      const res = await axios.delete(`https://ecommmerce-mern.onrender.com/api/cart/clear`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
  
      if (res.data.success) {
        fetchCart()
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Clear cart failed:", err.response?.data || err.message);
    }
  }
  

  return (
    <CartContext.Provider value={{ addToCart, cart, setCart,loading, fetchCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
