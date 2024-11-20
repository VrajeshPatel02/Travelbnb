"use client";

import { useEffect, useState } from "react";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/property/allProperties");
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError(err.message);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-lg border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl">
        <div className="px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0">
            <a aria-current="page" className="flex items-center" href="/">
              <img
                className="h-7 w-auto"
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Logo"
              />
              <p className="sr-only">Website Title</p>
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-8">
            <label
              className="relative bg-white w-full flex items-center border py-2 px-2 rounded-2xl shadow-2xl focus-within:border-gray-300"
              htmlFor="search-bar"
            >
              <input
                id="search-bar"
                placeholder="Your keyword here"
                className="px-6 py-2 w-full rounded-md outline-none bg-white"
              />
              <button
                className="px-6 py-3 bg-black border-black text-white rounded-xl transition-all duration-150"
                type="button"
              >
                Search
              </button>
            </label>
          </div>

          {/* Login and Sign Up */}
          <div className="flex items-center gap-3">
            <a
              className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
              href="/pages/sign-up"
            >
              Sign Up
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500"
              href="/pages/login"
            >
              Login
            </a>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-24 px-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Properties</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  className="h-48 w-full object-cover"
                  src="https://via.placeholder.com/400x300" // Replace with property image URL
                  alt={property.name}
                />
                <div className="p-4">
                  <h2 className="text-xl text-neutral-600 font-semibold">{property.name}</h2>
                  <p className="text-sm text-gray-500">
                    Guests: {property.noGuests}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.no_bedrooms} Bedrooms • {property.no_bathrooms} Bathrooms
                  </p>
                  <p className="text-lg  text-neutral-600 font-bold mt-2">
                    ₹{property.price.toLocaleString()}
                  </p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No properties found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
