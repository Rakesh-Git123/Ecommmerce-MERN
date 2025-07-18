import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-500">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs sm:text-sm border-t border-gray-700">
        © {new Date().getFullYear()} ShopVerse Admin Panel. All rights reserved.
      </div>
    </footer>
  );
};

export default AdminFooter;
