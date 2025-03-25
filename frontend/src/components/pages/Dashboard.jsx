import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../CSS_config/Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Function to determine if a link is active
  const isActive = (route) => {
    if (route === '/dashboard' && path === '/dashboard') return true;
    if (route !== '/dashboard' && path.startsWith(route)) return true;
    return false;
  };
  
  // Function to get the title based on current path
  const getTitle = () => {
    if (path === '/dashboard') return 'Trang chủ';
    if (path.startsWith('/devices')) return 'Quản lý thiết bị';
    if (path.startsWith('/usage')) return 'Dữ liệu sử dụng';
    if (path.startsWith('/profile')) return 'Hồ sơ người dùng';
    return 'Dashboard';
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      <Helmet>
        <title>Smart Home - {getTitle()}</title>
      </Helmet>
      
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Smart Home</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1">
          <ul className="py-4">
            <li className="mb-1">
              <Link 
                to="/dashboard" 
                className={`flex items-center px-6 py-3 ${isActive('/dashboard') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Trang chủ</span>
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/devices" 
                className={`flex items-center px-6 py-3 ${isActive('/devices') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
                <span>Quản lý thiết bị</span>
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/usage" 
                className={`flex items-center px-6 py-3 ${isActive('/usage') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>Dữ liệu sử dụng</span>
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/profile" 
                className={`flex items-center px-6 py-3 ${isActive('/profile') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Hồ sơ</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors duration-200">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Đăng xuất</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">{getTitle()}</h2>
          </div>
        </header>
        
        {/* Dashboard Content - Using Outlet */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

