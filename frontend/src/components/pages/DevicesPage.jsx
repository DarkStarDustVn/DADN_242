import React, { useState, useEffect } from 'react';
import deviceManager from '../../utils/DeviceManager';
import axios from 'axios';

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '',
    name: '',
    type: '',
    status: false,
    isOnline: true,
    power: 0,
    speed: 50
  });

  // Handle edit device button click
  const handleEditDevice = (id) => {
    const device = deviceManager.getDeviceById(id);
    if (device) {
      setEditFormData({
        _id: device._id,
        name: device.name,
        type: device.type,
        status: device.status,
        isOnline: device.isOnline,
        power: device.power || 0,
        speed: device.speed || 50
      });
      setShowEditModal(true);
    }
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle edit form submission
  const handleSubmitEditDevice = async (e) => {
    e.preventDefault();
    
    try {
      // Update device in DeviceManager
      if (editFormData.type !== 'fan') {
        await deviceManager.updateDevice(editFormData._id, {
          name: editFormData.name,
          type: editFormData.type,
          status: editFormData.status,
          power: parseInt(editFormData.power) || 0,
          isOnline: editFormData.isOnline
        });
      } else{
        await deviceManager.updateDevice(editFormData._id, {
          name: editFormData.name,
          type: editFormData.type,
          power: parseInt(editFormData.power) || 0,
          speed: parseInt(editFormData.speed) || 0
        });
      }
      // Send updated data to API
      const username = import.meta.env.VITE_AIO_USERNAME;
      const aioKey = import.meta.env.VITE_AIO_KEY;
      
      // Update device status if it's a fan
      if (editFormData.type === 'fan' && editFormData.status) {
        const fanUrl = `https://io.adafruit.com/api/v2/${username}/feeds/bbc-fan/data`;
        try {
          await axios.post(
            fanUrl,
            { value: editFormData.speed.toString() },
            { headers: { 'X-AIO-Key': aioKey } }
          );
        } catch (error) {
          console.error('Error updating fan data:', error);
        }
      }
      
      // Update devices list
      setDevices([...deviceManager.getAllDevices()]);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  // Load devices from DeviceManager
  useEffect(() => {
    const loadDevices = () => {
      const filteredDevices = deviceManager.searchDevices(searchQuery);
      setDevices(filteredDevices);
    };
    
    loadDevices();
  }, [searchQuery]);

  // Handle device toggle
  const handleToggleDevice = async (id) => {
    const device = deviceManager.getDeviceById(id);
    const newStatus = !device.status;
    
    try {
       const updatedDevice = await deviceManager.updateDevice(id, { 
          status: newStatus,
          isOnline: newStatus
        });

      // if (!updatedDevice) {
      //   console.error("Không thể cập nhật trạng thái thiết bị");
      //   return;
      // }

      // Gửi dữ liệu đến Adafruit IO
      const valueToSend = newStatus ? 1 : 0;
      const username = import.meta.env.VITE_AIO_USERNAME;
      let feedKey = '';
      
      if (device.type === 'light') {
        feedKey = 'bbc-led';
      } else if (device.type === 'state') {
        feedKey = 'bbc-state';
      } 

      if (feedKey) {
        const aioKey = import.meta.env.VITE_AIO_KEY;
        const url = `https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data`;
        
        try {
          const response = await axios.post(url, 
            { value: valueToSend.toString() },
            { headers: { 'X-AIO-Key': aioKey } }
          );
 
        } catch (error) {
          console.error('Error sending data to', feedKey, ':', error);
          console.error('Error details:', error.response ? error.response.data : 'No response data');
        }
      }

      // Cập nhật danh sách thiết bị trong state
      setDevices([...deviceManager.getAllDevices()]);
    } catch (error) {
      console.error('Error toggling device:', error);
    }
  };



  // Handle fan speed change
  const handleFanSpeedChange = async (id, speed, status = null) => {
    try {
      const device = deviceManager.getDeviceById(id);
      if (!device) {
        console.error("Không tìm thấy thiết bị với ID:", id);
        return;
      }
      
      // Prepare update data
      const updateData = { speed };
      
      // If status is provided, update it too
      if (status !== null) {
        updateData.status = status;
        updateData.isOnline = status;
      }
      
      // Update device in DeviceManager
      await deviceManager.updateDevice(id, updateData);
      
      // Send data to Adafruit IO
      const username = import.meta.env.VITE_AIO_USERNAME;
      const aioKey = import.meta.env.VITE_AIO_KEY;
      const url = `https://io.adafruit.com/api/v2/${username}/feeds/bbc-fan/data`;
      
      // If turning off, send 0, otherwise send the speed
      const valueToSend = (status === false) ? "0" : speed.toString();
      
      try {
        const response = await axios.post(url, 
          { value: valueToSend },
          { headers: { 'X-AIO-Key': aioKey } }
        );

      } catch (error) {
        console.error('Error updating fan:', error);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
      }
      
      // Update devices list
      setDevices([...deviceManager.getAllDevices()]);
    } catch (error) {
      console.error('Error changing fan settings:', error);
    }
  };



  // Handle device deletion
  const handleDeleteDevice = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      // Xóa thiết bị từ deviceManager - đã được cập nhật để xóa dữ liệu trong localStorage
      deviceManager.deleteDevice(id);
      setDevices([...deviceManager.getAllDevices()]);
      
    }
  };


  // State for modal and form data
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'light',
    status: false,
    isOnline: true,
    power: 0,
    speed: 50 // Default fan speed
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle adding a new device with modal form
  const handleAddDevice = () => {
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmitDevice = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      deviceManager.addDevice(formData);
      setDevices([...deviceManager.getAllDevices()]); // Update state with fresh data
      setShowModal(false);
      // Reset form data
      setFormData({
        name: '',
        type: 'light',
        status: false,
        isOnline: true,
        power: 0
      });
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">

        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm thiết bị..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="absolute left-3 top-2.5">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">State Control:</span>
              <div className="relative inline-block w-12 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggle-state"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500"
                  onChange={async (e) => {
                    const valueToSend = e.target.checked ? 1 : 0;
                    const username = import.meta.env.VITE_AIO_USERNAME;
                    const aioKey = import.meta.env.VITE_AIO_KEY;
                    const url = `https://io.adafruit.com/api/v2/${username}/feeds/bbc-state/data`;
                    
                    try {
                      const response = await axios.post(url, 
                        { value: valueToSend.toString() },
                        { headers: { 'X-AIO-Key': aioKey } }
                      );

                    } catch (error) {
                      console.error('Error updating state:', error);
                    }
                  }}
                />
                <label htmlFor="toggle-state" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              onClick={handleAddDevice}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Thêm thiết bị mới
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Device Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Thêm thiết bị mới</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitDevice} className="p-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên thiết bị</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên thiết bị"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Loại thiết bị</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Đèn</option>
                  <option value="ac">Điều hòa</option>
                  <option value="fan">Quạt</option>
                  <option value="tv">TV</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="power" className="block text-sm font-medium text-gray-700 mb-1">Công suất (W)</label>
                <input
                  type="number"
                  id="power"
                  name="power"
                  value={formData.power}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập công suất"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Thêm thiết bị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Device Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Chỉnh sửa thiết bị</h3>
              <button 
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitEditDevice} className="p-4">
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Tên thiết bị</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên thiết bị"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-1">Loại thiết bị</label>
                <select
                  id="edit-type"
                  name="type"
                  value={editFormData.type}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Đèn</option>
                  <option value="ac">Điều hòa</option>
                  <option value="fan">Quạt</option>
                  <option value="tv">TV</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="edit-power" className="block text-sm font-medium text-gray-700 mb-1">Công suất (W)</label>
                <input
                  type="number"
                  id="edit-power"
                  name="power"
                  value={editFormData.power}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập công suất"
                  min="0"
                />
              </div>
              {editFormData.type === 'fan' && (
                <div className="mb-4">
                  <label htmlFor="edit-speed" className="block text-sm font-medium text-gray-700 mb-1">Tốc độ quạt (%)</label>
                  <input
                    type="range"
                    id="edit-speed"
                    name="speed"
                    min="0"
                    max="100"
                    step="1"
                    value={editFormData.speed}
                    onChange={handleEditInputChange}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{editFormData.speed}%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.length === 0 ? (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500">Không tìm thấy thiết bị nào</p>
          </div>
        ) : (
          devices.map(device => (
            <div key={device._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-semibold">{device.name}</h4>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name={`toggle-${device._id}`} 
                    id={`toggle-${device._id}`} 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500"
                    checked={device.status}
                    onChange={() => {
                      if (device.type === 'fan') {
                        // For fans, use handleFanSpeedChange with current speed or 0 if turning off
                        const newStatus = !device.status;
                        const newSpeed = newStatus ? (device.speed || 50) : 0;
                        handleFanSpeedChange(device._id, newSpeed, newStatus);
                      } else {
                        // For other devices, use the regular toggle function
                        handleToggleDevice(device._id);
                      }
                    }}
                  />
                  <label htmlFor={`toggle-${device._id}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className={`w-2 h-2 rounded-full ${device.status ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-sm text-gray-600">{device.status ? 'Online' : 'Offline'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {device.type === 'ac' && device.temperature && (
                    <div className="bg-gray-100 p-2 rounded">
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="font-medium">{device.temperature}°C</p>
                    </div>
                  )}
                  
                  {/* Fan speed control */}
                  {device.type === 'fan' && device.status && (
                    <div className="col-span-2 bg-gray-100 p-3 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500">Tốc độ quạt</p>
                        <p className="text-xs font-medium">{device.speed || 0}%</p>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={device.speed || 0}
                        onChange={(e) => handleFanSpeedChange(device._id, parseInt(e.target.value), true)}
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-xs text-gray-500">Công suất</p>
                    <p className="font-medium">{device.power}W</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-xs text-gray-500">Trạng thái hoạt động</p>
                    <p className="font-medium">
                      {device.status 
                        ? 'Đang hoạt động'
                        : 'Đã tắt'
                      }
                    </p>
                  </div>
                </div>
      
                <div className="flex justify-between">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditDevice(device._id)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteDevice(device._id)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DevicesPage;
