import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import smartHomeImg from '../assets/smart-home.jpg';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Validate and authenticate user
    if (email === '' || password === '') {
      alert('Please fill in all fields');
      return;
    }
    
    if (email === "manh.au150304@gmail.com" && password === "123456") {
      navigate('/dashboard');
    } else {
      alert('Email or password is incorrect');
      return;
    }
  }
  return (
    <div className="flex h-screen w-full">
      <Helmet>
        <title>Smart Home - Login</title>
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
      
      {/* Right side - Login Form */}
      <div className="w-full md:w-1/4 flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">Smart Home</h1>
            <p className="text-gray-400">Welcome back! Please login to your account.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                id="password" 
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="text-blue-500 hover:text-blue-400">
                  Forgot your password?
                </Link>
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Sign in
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-400">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;