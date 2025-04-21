import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import smartHomeImg from "../../assets/smart-home.jpg";
import '../CSS_config/ForgotPasswordPage.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Reset password failed');
      }
      setMessage(data.message);
      setTimeout(() => navigate('/'), 1500); // Redirect to login after 3s
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Helmet>
        <title>Smart Home - Reset Password</title>
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
      {/* Right side - Reset Password Form */}
      <div className="w-full md:w-1/4 flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">Đặt mật khẩu mới</h1>
            <p className="text-gray-400">Nhập mật khẩu mới của bạn bên dưới.</p>
          </div>
          {message && <p className="text-green-400 mb-4 text-center">{message}</p>}
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
              >
                {loading ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
              </button>
            </div>
            <div className="text-center text-sm text-gray-400">
              Đã nhớ mật khẩu?{' '}
              <Link to="/" className="text-blue-500 hover:text-blue-400">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;