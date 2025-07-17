import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from '../components/UserNavbar';
import Footer from '../components/Footer';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://ecommmerce-mern.onrender.com/api/order/my-orders', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      console.log(response.data.orders);
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <UserNavbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <UserNavbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow">
            Error: {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />

      <div className="flex-grow max-w-5xl mx-auto p-6 w-full">
        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg p-5 mb-6 shadow-sm"
            >
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Order ID: <span className="font-mono">{order._id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Status: <span className="font-semibold text-blue-700">{order.status}</span>
                </p>
              </div>

              <div className="mb-3">
                <h4 className="font-semibold mb-1">Shipping Address:</h4>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                <p>Email: {order.shippingAddress.email}</p>
                <p>Phone: {order.shippingAddress.phoneNo}</p>
              </div>

              <div className="mb-3">
                <h4 className="font-semibold mb-1">Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-700 border-b py-1">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 font-semibold text-lg">
                <span>Total:</span>
                <span>₹{order.totalPrice}</span>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Payment Method: {order.paymentMethod}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
