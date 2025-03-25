import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import smartHomeImg from "../../assets/smart-home.jpg";
import '../CSS config/RegisterPage.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [sex, setSex] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async(e) => {
    e.preventDefault();
    
    // Form validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !sex) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:8000/api/users/register', {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        sex
      });
      
      if (response.data) {
        // Registration successful
        navigate('/'); // Redirect to login page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Helmet>
        <title>Smart Home - Register</title>
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
      
      {/* Right side - Registration Form */}
      <div className="w-full md:w-2/4 flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Sign up to start controlling your smart home</p>
          </div>
          
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Name fields - 2 inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">First Name*</label>
                <input 
                  type="text" 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">Last Name*</label>
                <input 
                  type="text" 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last name"
                />
              </div>
            </div>
            
            {/* Contact fields - 2 inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address*</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                <input 
                  type="text"
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone number"
                />
              </div>
            </div>
            
            {/* Address fields - 2 inputs per row */}
            <div className="grid gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <input 
                  type="text"
                  id="address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Street address"
                />
              </div>
            </div>

            {/* Gender selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Giới tính*</label>
              <div className="flex space-x-4">
                <div 
                  onClick={() => setSex('male')}
                  className={`flex-1 py-3 px-4 border ${sex === 'male' ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-700'} rounded-md cursor-pointer text-center hover:bg-gray-700 transition-colors`}
                >
                  Male
                </div>
                <div 
                  onClick={() => setSex('female')}
                  className={`flex-1 py-3 px-4 border ${sex === 'female' ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-700'} rounded-md cursor-pointer text-center hover:bg-gray-700 transition-colors`}
                >
                  Female
                </div>
              </div>
            </div>

            {/* Password fields - 2 inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password*</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">Confirm Password*</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm password"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/" className="text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;