import { useContext, useEffect } from "react";
import AdminDashboard from "./AdminDashBoard";
import UserDashboard from "./UserDashboard";
import { AuthContext } from "../Context/AuthContext";
import ProtectedRoute from "../ProtectedRoute";

const Dashboard = () => {
  const { user, checkAuth, loading } = useContext(AuthContext);
  useEffect(() => {
    checkAuth();
  }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }
  
  return (
    <>
      <div>
        {user?.isAdmin ? (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ) : (
          <UserDashboard />
        )}
      </div>
    </>
  );
};

export default Dashboard;
