import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import { ProductProvider } from "./Context/ProductContext";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Orders = lazy(() => import("./pages/Orders"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductProvider>
              <Suspense fallback={
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              }>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forget-password" element={<ForgetPassword />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/place-order"
                    element={
                      <ProtectedRoute>
                        <PlaceOrder />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-success"
                    element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/order"
                    element={
                      <ProtectedRoute>
                        <AdminOrders />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </ProductProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
