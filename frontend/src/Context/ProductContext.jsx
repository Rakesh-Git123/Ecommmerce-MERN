import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
  const fetchProducts = async ({search="",category="",sortOrder}) => {
    try {
      setLoading(true);
      const response = await axios.get('https://ecommmerce-mern.onrender.com/api/product/category', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        params: {
          search,
          category: category === 'all' ? '' : category,
          sort: sortOrder,
        },
      });
      setProducts(response.data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
