import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import smartHomeImg from "../../assets/smart-home.jpg";
import '../CSS_config/RegisterPage.css';

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
          <p className="text-xl">Điều khiển môi trường nhà của bạn với giao diện tiện lợi của chúng tôi</p>
        </div>
      </div>
      
      {/* Right side - Registration Form */}
      <div className="w-full md:w-2/4 flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Tạo tài khoản mới</h1>
            <p className="text-gray-400">Đăng ký để bắt đầu điều kiển thiết bị thông minh của bạn</p>
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
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">Tên*</label>
                <input 
                  type="text" 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">Họ*</label>
                <input 
                  type="text" 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ"
                />
              </div>
            </div>
            
            {/* Contact fields - 2 inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Địa chỉ Email*</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập Email"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Số điện thoại*</label>
                <input 
                  type="text"
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            
            {/* Address fields - 2 inputs per row */}
            <div className="grid gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Địa chỉ*</label>
                <input 
                  type="text"
                  id="address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ"
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
                  Nam
                </div>
                <div 
                  onClick={() => setSex('female')}
                  className={`flex-1 py-3 px-4 border ${sex === 'female' ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-700'} rounded-md cursor-pointer text-center hover:bg-gray-700 transition-colors`}
                >
                  Nữ
                </div>
              </div>
            </div>

            {/* Password fields - 2 inputs per row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Mật khẩu*</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">Xác nhận mật khẩu*</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70"
              >
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Bạn đã có tài khoản?{' '}
              <Link to="/" className="text-blue-500 hover:text-blue-400">
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;