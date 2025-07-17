import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [Allusers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auth", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setAllUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:4000/api/auth/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-semibold text-red-600 mb-4">
            Unauthorized Access
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to view this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-blue-50">
            <h2 className="text-2xl font-semibold text-blue-800">
              User Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {Allusers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={
                          user.profilePic ||
                          "https://staging.svgrepo.com/show/295402/user-profile.svg"
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      {!user.isAdmin && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 px-4 py-2 rounded-md transition font-medium text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {Allusers.length === 0 && (
              <div className="px-6 py-6 text-center text-gray-500">
                No users found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
