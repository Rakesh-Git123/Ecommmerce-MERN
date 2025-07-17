import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { CartContext } from '../Context/CartContext';
import UserNavbar from '../components/UserNavbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { cart, fetchCart, clearCart } = useContext(CartContext);
  console.log(cart);
  const items = cart?.items || [];
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phoneNo: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );
  const shippingFee = 10;
  const totalPrice = subtotal + shippingFee;

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = async () => {
    if (items.length === 0) {
      return alert('Your cart is empty');
    }

    const orderItems = items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const payload = {
      items: orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    };

    try {
      setLoading(true);
      let res=await axios.post('https://ecommmerce-mern.onrender.com/api/order', payload, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if(res.data.success){
        alert('Order placed successfully');
        clearCart()
        navigate('/order-success');
      }
      else{
        alert(res.data.message)
      }

      
    } catch (error) {
      console.error(error);
      alert('Order failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />

      <div className="flex flex-col lg:flex-row gap-10 px-6 py-10 max-w-6xl mx-auto flex-grow">
  
        <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-bold border-b pb-1 mb-6">
            DELIVERY <span className="text-gray-700 font-semibold">INFORMATION</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              value={shippingAddress.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="email"
              value={shippingAddress.email}
              onChange={handleChange}
              placeholder="Email address"
              className="border p-2 rounded"
              required
            />
          </div>

          <input
            type="text"
            name="address"
            value={shippingAddress.address}
            onChange={handleChange}
            placeholder="Street Address"
            className="border p-2 rounded w-full mt-6"
            required
          />

          <div className="grid grid-cols-2 gap-6 mt-6">
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleChange}
              placeholder="City"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="state"
              onChange={handleChange}
              placeholder="State"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="country"
              value={shippingAddress.country}
              onChange={handleChange}
              placeholder="Country"
              className="border p-2 rounded"
              required
            />
          </div>

          <input
            type="text"
            name="phoneNo"
            value={shippingAddress.phoneNo}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 rounded w-full mt-6"
            required
          />
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-bold border-b pb-1 mb-6">
            CART <span className="text-gray-700 font-semibold">TOTALS</span>
          </h2>

          <div className="bg-white border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>₹{shippingFee}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <h2 className="text-lg font-bold border-b mt-12 pb-1 mb-4">
            PAYMENT <span className="text-gray-700 font-semibold">METHOD</span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
            {['Stripe', 'Razorpay', 'Cash on Delivery'].map((method) => (
              <label
                key={method}
                className={`flex items-center gap-2 border px-4 py-2 rounded cursor-pointer flex-1 ${
                  paymentMethod === method ? 'border-black font-semibold' : 'text-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                {method}
              </label>
            ))}
          </div>

          <button
            onClick={handleOrder}
            disabled={loading}
            className="mt-8 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition w-full"
          >
            {loading ? 'Placing Order...' : 'PLACE ORDER'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlaceOrder;
