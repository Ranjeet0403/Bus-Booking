import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <nav className="bg-red-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">SarkariiBUSS</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-gray-200">
              Home
            </Link>
            {isLoggedIn && (
              <Link to="/my-bookings" className="text-white hover:text-gray-200">
                My Bookings
              </Link>
            )}
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-white hover:text-gray-200">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-red-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-white">{userEmail}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
