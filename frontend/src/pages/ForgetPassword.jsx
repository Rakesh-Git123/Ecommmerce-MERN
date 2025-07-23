import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { AuthContext } from "../Context/AuthContext";

const ForgetPassword = () => {
  const { setCart } = useContext(CartContext);
  const { checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1 = Request OTP, Step 2 = Reset with OTP
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const res = await axios.post(
        "https://ecommmerce-mern.onrender.com/api/auth/sendOtp",
        { email: formData.email }
      );
      if (res.data.success) {
        setSuccess("OTP sent to your email.");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmNewPassword) {
      return setError("Passwords do not match");
    }

    if (formData.newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://ecommmerce-mern.onrender.com/api/auth/forgetPassword",
        {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }
      );
      if (res.data.success) {
        alert("Password reset successful!");
        localStorage.removeItem("token");
        setCart([]);
        checkAuth();
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {step === 1 ? "Request OTP" : "Reset Your Password"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={step === 1 ? handleRequestOtp : handleResetPassword}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="mt-2 text-sm text-indigo-600 hover:underline"
                >
                  {loading ? "Sending OTP..." : "Generate New OTP"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  required
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Processing..."
              : step === 1
              ? "Send OTP"
              : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            className="text-indigo-600 hover:underline text-sm"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
