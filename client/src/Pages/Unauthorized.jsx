import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black px-4">
      <h1 className="text-5xl font-bold  mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
      <Link
        to="/home"
        className="px-4 py-2 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;
