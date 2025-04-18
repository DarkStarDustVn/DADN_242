import React, { useState, useEffect } from 'react';
import deviceManager from '../../utils/DeviceManager';
import axios from 'axios';

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [offTimes, setOffTimes] = useState({});
 
  // Load devices from DeviceManager
  useEffect(() => {
    const loadDevices = () => {
      const filteredDevices = deviceManager.searchDevices(searchQuery);
      setDevices(filteredDevices);
    };
    
    loadDevices();
  }, [searchQuery]);

  // Update off time counter every second for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      // Force re-render to update displayed off times
      setDevices([...deviceManager.getAllDevices()]);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Load saved off times from localStorage and update if devices were off while page was closed
  useEffect(() => {
    const savedOffTimes = localStorage.getItem('deviceOffTimes');
    if (savedOffTimes) {
      const parsedOffTimes = JSON.parse(savedOffTimes);
      
      // Check for devices that were off when the page was closed
      const updatedOffTimes = {...parsedOffTimes};
      let hasUpdates = false;
      
      deviceManager.getAllDevices().forEach(device => {
        // If device is still off and has a recorded start time, update the total off time
        if (!device.status && parsedOffTimes[device.id] && parsedOffTimes[device.id].startTime) {
          const currentTime = new Date().getTime();
          const lastRecordedTime = parsedOffTimes[device.id].startTime;
          const additionalOffTime = currentTime - lastRecordedTime;
          
          // Update the start time to current time to continue tracking
          updatedOffTimes[device.id] = {
            startTime: currentTime,
            totalOffTime: (parsedOffTimes[device.id].totalOffTime || 0) + additionalOffTime
          };
          hasUpdates = true;
        }
      });
      
      // Save updates if any were made
      if (hasUpdates) {
        localStorage.setItem('deviceOffTimes', JSON.stringify(updatedOffTimes));
      }
      
      setOffTimes(updatedOffTimes);
    }
  }, []);

  // Handle device toggle
  const handleToggleDevice = (id) => {
    const device = deviceManager.getDeviceById(id);
    // Cập nhật cả trạng thái online/offline khi toggle thiết bị
    const updatedDevice = deviceManager.updateDevice(id, { 
      status: !device.status,
      isOnline: !device.status // Thiết bị sẽ online khi bật, offline khi tắt
    });
    
    // If turning off, record the time
    if (device && device.status && !updatedDevice.status) {
      const newOffTimes = {
        ...offTimes,
        [id]: {
          startTime: new Date().getTime(),
          totalOffTime: offTimes[id]?.totalOffTime || 0
        }
      };
      setOffTimes(newOffTimes);
      localStorage.setItem('deviceOffTimes', JSON.stringify(newOffTimes));
    }
    
    // If turning on, calculate the off duration
    if (device && !device.status && updatedDevice.status) {
      if (offTimes[id] && offTimes[id].startTime) {
        const currentTime = new Date().getTime();
        const offDuration = currentTime - offTimes[id].startTime;
        const totalOffTime = (offTimes[id].totalOffTime || 0) + offDuration;
        
        const newOffTimes = {
          ...offTimes,
          [id]: {
            startTime: null,
            totalOffTime: totalOffTime
          }
        };
        setOffTimes(newOffTimes);
        localStorage.setItem('deviceOffTimes', JSON.stringify(newOffTimes));
      }
    }
    
    setDevices([...deviceManager.getAllDevices()]); // Update state with fresh data
  };

  // Handle device deletion
  const handleDeleteDevice = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      deviceManager.deleteDevice(id);
      
      // Also remove device from offTimes tracking
      const newOffTimes = {...offTimes};
      delete newOffTimes[id];
      setOffTimes(newOffTimes);
      localStorage.setItem('deviceOffTimes', JSON.stringify(newOffTimes));
      
      setDevices([...deviceManager.getAllDevices()]); // Update state with fresh data
    }
  };

  // State for modal and form data
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'light',
    status: false,
    isOnline: true,
    power: 0
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
      const newDevice = deviceManager.addDevice(formData);
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

  // Format off time to display in minutes, hours, or days
  const formatOffTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} ngày ${hours % 24} giờ`;
    } else if (hours > 0) {
      return `${hours} giờ ${minutes % 60} phút`;
    } else {
      return `${minutes} phút`;
    }
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
      
      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.length === 0 ? (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500">Không tìm thấy thiết bị nào</p>
          </div>
        ) : (
          devices.map(device => (
            <div key={device.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-semibold">{device.name}</h4>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name={`toggle-${device.id}`} 
                    id={`toggle-${device.id}`} 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500"
                    checked={device.status}
                    onChange={() => handleToggleDevice(device.id)}
                  />
                  <label htmlFor={`toggle-${device.id}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
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
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-xs text-gray-500">Power</p>
                    <p className="font-medium">{device.power}W</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-xs text-gray-500">Trạng thái hoạt động</p>
                    <p className="font-medium">
                      {device.status 
                        ? 'Đang hoạt động'
                        : offTimes[device.id]?.startTime
                          ? 'Đã tắt ' + formatOffTime(new Date().getTime() - offTimes[device.id].startTime) + ' trước'
                          : 'Đã tắt'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button className="text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteDevice(device.id)}
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