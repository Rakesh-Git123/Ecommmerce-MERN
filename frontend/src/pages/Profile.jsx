import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, checkAuth } = useContext(AuthContext);

  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setImagePreview(user.profilePic);
      setName(user.name);
    }
  }, [user]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (editImage) {
      formData.append("profilePic", editImage);
    }
    formData.append("name", name);

    try {
      await axios.patch(
        "https://ecommmerce-mern.onrender.com/api/auth/updateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      checkAuth();
      alert("Profile Updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <main className="flex-grow flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-white text-gray-900">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Update Profile
          </h2>

          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
              <img
                src={
                  imagePreview ||
                  user?.profilePic ||
                  "https://staging.svgrepo.com/show/295402/user-profile.svg"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="imageUpload"
              className="mt-2 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Change Picture
            </label>
            <input
              type="file"
              id="imageUpload"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Show role and joined date below the image */}
            <p className="mt-3 text-sm text-gray-700">
              <strong>Role:</strong> {user?.isAdmin ? "Admin" : "User"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Joined:</strong>{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                disabled
                value={user?.email || ""}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center gap-2 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 animate-spin text-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 
                         50 100.591C22.3858 100.591 0 78.2051 
                         0 50.5908C0 22.9766 22.3858 0.59082 
                         50 0.59082C77.6142 0.59082 100 22.9766 
                         100 50.5908ZM9.08144 50.5908C9.08144 
                         73.1895 27.4013 91.5094 50 91.5094C72.5987 
                         91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 
                         27.9921 72.5987 9.67226 50 9.67226C27.4013 
                         9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 
                         35.9116 97.0079 33.5539C95.2932 28.8227 
                         92.871 24.3692 89.8167 20.348C85.8452 
                         15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
                         4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
                         0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 
                         1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
                         9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 
                         9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 
                         10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
                         17.9648 79.3347 21.5619 82.5849 25.841C84.9175 
                         28.9121 86.7997 32.2913 88.1811 35.8758C89.083 
                         38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Updating Profile
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
          <button
            onClick={() => navigate("/forget-password")}
            className="w-full py-2.5 rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center gap-2 mt-4"
          >
            Update Password
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
