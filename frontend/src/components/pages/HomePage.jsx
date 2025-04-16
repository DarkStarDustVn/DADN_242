import React from 'react';

const HomePage = () => {
  return (
    <div className="p-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Temperature Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Temperature</p>
              <p className="text-2xl font-semibold">24°C</p>
              <p className="text-green-500 text-sm">+2% from yesterday</p>
            </div>
          </div>
        </div>
        
        {/* Humidity Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Humidity</p>
              <p className="text-2xl font-semibold">65%</p>
              <p className="text-red-500 text-sm">-5% from yesterday</p>
            </div>
          </div>
        </div>
        
        {/* Brightness Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Độ sáng</p>
              <p className="text-2xl font-semibold">65%</p>
              <p className="text-yellow-500 text-sm">+8% from yesterday</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Visualization Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Thống kê dữ liệu</h3>
        <div className="h-80 bg-violet-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Data visualization chart will be displayed here</p>
        </div>
      </div>
      
      {/* Device Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Device Status</h3>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                <span>Living Room Light</span>
              </div>
              <span className="text-green-500">On</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                <span>Kitchen Light</span>
              </div>
              <span className="text-red-500">Off</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                <span>Air Conditioner</span>
              </div>
              <span className="text-green-500">On</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                <span>Smart TV</span>
              </div>
              <span className="text-red-500">Off</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Today, 10:30 AM</span>
              </div>
              <p>Living Room Light turned on</p>
            </li>
            <li className="py-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Today, 09:15 AM</span>
              </div>
              <p>Temperature set to 24°C</p>
            </li>
            <li className="py-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Yesterday, 08:00 PM</span>
              </div>
              <p>All lights turned off</p>
            </li>
            <li className="py-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Yesterday, 06:30 PM</span>
              </div>
              <p>Smart TV turned on</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;