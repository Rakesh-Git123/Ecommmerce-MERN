import React from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />

      <div className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-10">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={60} />
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been placed and will be delivered soon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Go to Home
            </Link>
            <Link
              to="/order"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
