import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { AuthContext } from '../Context/AuthContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/order', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setOrders(res.data.orders || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/order/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: localStorage.getItem('token') },
        }
      );
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-semibold text-red-600 mb-4">Unauthorized</h1>
          <p className="text-gray-600">Only admins can view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />

      <div className="max-w-6xl mx-auto p-6 w-full flex-grow">
        <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
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
                  Status:
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="ml-2 border border-gray-300 px-2 py-1 rounded"
                  >
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
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

export default AdminOrders;
