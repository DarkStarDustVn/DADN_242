import React from 'react';

const DevicesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Quản lý thiết bị</h3>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm thiết bị..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Thêm thiết bị mới
          </button>
        </div>
      </div>
      
      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Device Card 1 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-semibold">Living Room Light</h4>
            <div className="relative inline-block w-12 align-middle select-none">
              <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500"/>
              <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs text-gray-500">Power</p>
                <p className="font-medium">12W</p>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs text-gray-500">Last Active</p>
                <p className="font-medium">2 mins ago</p>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="text-blue-600 hover:text-blue-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Device Card 2 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-semibold">Kitchen Light</h4>
            <div className="relative inline-block w-12 align-middle select-none">
              <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500"/>
              <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-600">Offline</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs text-gray-500">Power</p>
                <p className="font-medium">0W</p>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs text-gray-500">Last Active</p>
                <p className="font-medium">2 hours ago</p>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="text-blue-600 hover:text-blue-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Device Card 3 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-semibold">Air Conditioner</h4>
            <div className="relative inline-block w-12 align-middle select-none">
              <input type="checkbox" name="toggle" id="toggle3" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-0 checked:translate-x-6 checked:border-green-500" checked/>
              <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs text-gray-500">Temperature</p>
                <p className="font-medium">24°C</p>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs text-gray-500">Power</p>
                <p className="font-medium">850W</p>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="text-blue-600 hover:text-blue-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicesPage;