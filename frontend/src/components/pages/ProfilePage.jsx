import React, { useState, useEffect } from "react";
import axios from "axios";
const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    sex: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin người dùng từ API khi component được tải
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        //console.log('Token:', localStorage); // Log token để kiểm tra
        //console.log('Token:', token); // Log token để kiểm tra
        if (!token) {
          throw new Error("Không tìm thấy token đăng nhập");
        }

        // Kiểm tra thông tin người dùng trong localStorage trước
        const userJson = localStorage.getItem("user");
        let userFromStorage = null;

        if (userJson) {
          userFromStorage = JSON.parse(userJson);
          // Nếu có ảnh đại diện trong thông tin người dùng, sử dụng nó
          if (userFromStorage.profileImage) {
            setProfileImage(userFromStorage.profileImage);
          }
        }

        // Gọi API với token xác thực và thêm token vào đường dẫn URL
        const response = await axios.get(
          `http://localhost:8000/api/users/${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Cập nhật state với dữ liệu người dùng
        if (response.data) {
          const user = response.data; // Lấy người dùng đầu tiên từ danh sách
          setUserData(user);

          // Nếu chưa có ảnh đại diện từ localStorage, kiểm tra từ API
          if (!profileImage && user.profileImage) {
            setProfileImage(user.profileImage);

            // Cập nhật thông tin người dùng trong localStorage với ảnh đại diện từ API
            if (userFromStorage) {
              userFromStorage.profileImage = user.profileImage;
              localStorage.setItem("user", JSON.stringify(userFromStorage));
            }
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Không thể tải thông tin người dùng");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [profileImage]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      // Lưu URL hình ảnh vào state
      setProfileImage(imageUrl);

      // Lưu ảnh vào thông tin người dùng trong localStorage
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        user.profileImage = imageUrl;
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Upload ảnh lên server
      // const token = localStorage.getItem('token');
      // if (token) {
      //   const formData = new FormData();
      //   formData.append('profileImage', file);

      //   axios.post('http://localhost:8000/api/users/upload-profile-image', formData, {
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //       'Content-Type': 'multipart/form-data'
      //     }
      //   })
      //     .then(response => console.log('Tải ảnh lên thành công', response))
      //     .catch(error => console.error('Lỗi khi tải ảnh lên:', error));
      // }
    }
  };

  // Hàm xóa hình ảnh đại diện
  const handleRemoveImage = () => {
    setProfileImage(null);

    // Xóa ảnh đại diện từ thông tin người dùng trong localStorage
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      user.profileImage = null;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  // Xử lý cập nhật thông tin cá nhân
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Cập nhật formData khi userData thay đổi
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    }
  }, [userData]);

  // Xử lý thay đổi input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý lưu thay đổi thông tin cá nhân
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setUpdateError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }

      const response = await axios.put(
        `http://localhost:8000/api/users/${token}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setUserData({
          ...userData,
          ...formData,
        });
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      setUpdateError(err.message || "Không thể cập nhật thông tin người dùng");
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center bg-red-100 p-6 rounded-lg shadow-md">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-20 h-20 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                )}
              </div>
              <h4 className="text-xl font-semibold">
                {userData.firstName} {userData.lastName}
              </h4>
              <p className="text-gray-500">{userData.email}</p>
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="profile-image-input"
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full cursor-pointer flex items-center justify-center"
                >
                  Cập nhật ảnh đại diện
                </label>
                {profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    type="button"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 w-full flex items-center justify-center"
                  >
                    Xóa ảnh đại diện
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-2">Thông tin liên hệ</h5>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  <span>{userData.phone || "Chưa cập nhật"}</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>{userData.email}</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span>{userData.address || "Chưa cập nhật"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Profile Details and Settings */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="font-semibold mb-4">Thông tin cá nhân</h4>
            {updateSuccess && (
              <div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
                role="alert"
              >
                <p>Cập nhật thông tin thành công!</p>
              </div>
            )}
            {updateError && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                role="alert"
              >
                <p>{updateError}</p>
              </div>
            )}
            <form onSubmit={handleSaveChanges}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                    value={userData.email || ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Lưu thay đổi
              </button>
            </form>
          </div>

          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="font-semibold mb-4">Đổi mật khẩu</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const currentPassword = e.target.currentPassword.value;
              const newPassword = e.target.newPassword.value;
              const confirmPassword = e.target.confirmPassword.value;
              
              if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Vui lòng điền đầy đủ thông tin');
                return;
              }
              
              if (newPassword !== confirmPassword) {
                alert('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return;
              }
              
              const token = localStorage.getItem('token');
              if (!token) {
                alert('Không tìm thấy token đăng nhập');
                return;
              }
              
              axios.put('http://localhost:8000/api/users/change-password', {
                currentPassword,
                newPassword
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
                .then(response => {
                  alert('Đổi mật khẩu thành công');
                  e.target.reset();
                })
                .catch(error => {
                  alert(error.response?.data?.message || 'Đổi mật khẩu thất bại');
                });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    name="currentPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Cập nhật mật khẩu
              </button>
            </form>
          </div> */}

          {/* <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-semibold mb-4">Cài đặt thông báo</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo qua email</p>
                  <p className="text-sm text-gray-500">Nhận thông báo về hoạt động thiết bị qua email</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input type="checkbox" name="toggle" id="toggle-email" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500"/>
                  <label htmlFor="toggle-email" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo qua SMS</p>
                  <p className="text-sm text-gray-500">Nhận thông báo về hoạt động thiết bị qua SMS</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input type="checkbox" name="toggle" id="toggle-sms" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500"/>
                  <label htmlFor="toggle-sms" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo về tiết kiệm năng lượng</p>
                  <p className="text-sm text-gray-500">Nhận thông báo về các gợi ý tiết kiệm năng lượng</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input type="checkbox" name="toggle" id="toggle-energy" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500"/>
                  <label htmlFor="toggle-energy" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
