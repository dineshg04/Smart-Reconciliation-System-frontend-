import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem('authtoken'); 
    setIsLoggedIn(!!token); 
  }, []);

 
  const handleLogout = () => {
    localStorage.removeItem('authtoken');  
    localStorage.removeItem('jobid');         
    setIsLoggedIn(false);
    navigate('/login');                         
  };

  return (
    <nav className="bg-indigo-50 rounded-3xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">
          Smart Reconciliation System
        </div>

        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link to="/"
              className='text-gray-700 hover:text-indigo-700 text-sm font-medium  transition-colors'>
              Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-700 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/uploadfile"
                className="text-gray-700 hover:text-indigo-700 text-sm font-medium transition-colors"
              >
                Reconciliation
              </Link>
              <Link
                to="/reconciliationview"
                className="text-gray-700 hover:text-indigo-700 text-sm font-medium transition-colors"
              >
                Reconciliation View
              </Link>
              <Link
                to="/auditlog"
                className="text-gray-700 hover:text-indigo-700 text-sm font-medium transition-colors"
              >
                Audit Log
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;