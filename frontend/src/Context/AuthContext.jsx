import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = async (userData) => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ecommmerce-mern.onrender.com/api/auth/signup",
        userData
      );

      if (response.data.success) {
        navigate("/login");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong during signup"
      );
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://ecommmerce-mern.onrender.com/api/auth/login",
        userData
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        checkAuth()
        navigate("/")
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong during login"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        "https://ecommmerce-mern.onrender.com/api/auth/checkAuth",
        {
            headers: {
                Authorization: localStorage.getItem("token"),
              },
        }
      );
      const data = res.data;
      if (data.success) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      return false;
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, checkAuth, login, signup, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
