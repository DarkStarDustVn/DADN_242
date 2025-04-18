import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import smartHomeImg from "../../assets/smart-home.jpg";
import "../CSS_config/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Validate and authenticate user
    if (email === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email,
          password,
        }
      );
      console.log("Login response:", response.data);
      
      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Nếu người dùng chọn ghi nhớ đăng nhập, lưu trạng thái đăng nhập
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        alert(
          error.response.data.message ||
            "Authentication failed. Please check your credentials."
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        alert("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        alert("Error: " + error.message);
      }
    }
  };
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // const handleLogout = () => {
    // Clear user data from local storage
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");

    // Redirect to the login page
  //   navigate("/login");
  // };
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };
  
  // Kiểm tra đăng nhập khi component được tải
  React.useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập
    if (isLoggedIn()) {
      // Redirect to the dashboard
      navigate("/dashboard");
    }
    
    // Kiểm tra nếu có ghi nhớ đăng nhập
    const remembered = localStorage.getItem("rememberMe");
    if (remembered === "true") {
      setRememberMe(true);
      // Có thể tự động điền email từ lần đăng nhập trước nếu cần
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData && userData.email) {
          setEmail(userData.email);
        }
      }
    }
  }, [navigate]);
  
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
          <p className="text-xl"> {/*Control your home environment with our intuitive dashboard*/}
            Điều khiển môi trường nhà của bạn với giao diện tiện lợi của chúng tôi
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/4 flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">Smart Home</h1>
            <p className="text-gray-400">
              Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                E-mail
              </label>
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Mật Khẩu
              </label>
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
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-400"
                >
                  Ghi Nhớ Đăng Nhập
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-400"
                >
                  Quên Mật Khẩu?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Đăng Nhập
              </button>
            </div>

            <div className="text-center text-sm text-gray-400">
              Không có tài khoản{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-400"
              >
                Đăng ký
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
