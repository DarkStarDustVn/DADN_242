import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import smartHomeImg from "../../assets/smart-home.jpg";
import '../CSS_config/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  return (
    <div className="flex h-screen w-full">
      <Helmet>
        <title>Smart Home - Forgot Password</title>
      </Helmet>
      
      {/* Left side - Smart Home Image and Text */}
      <div className="hidden md:flex md:w-3/4 relative">
        <img 
          src={smartHomeImg} 
          alt="Smart Home" 
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-bold mb-2">Smart Home</h1>
          <p className="text-xl">Control your home environment with our intuitive dashboard</p>
        </div>
      </div>
      
      {/* Right side - Forgot Password Form */}
      <div className="w-full md:w-1/4 flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-400">Enter your email address and we'll send you a link to reset your password.</p>
          </div>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Send Reset Link
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Remember your password?{' '}
              <Link to="/" className="text-blue-500 hover:text-blue-400">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;