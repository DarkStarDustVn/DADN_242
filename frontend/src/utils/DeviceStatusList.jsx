  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  // Device Status List Component with Pagination
  
  const DeviceStatusList = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const devicesPerPage = 5;

    useEffect(() => {
      const fetchDevices = async () => {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:8000/api/devices/all');
          if (Array.isArray(response.data)) {
            setDevices(response.data);
            setTotalPages(Math.ceil(response.data.length / devicesPerPage));
          }
        } catch (error) {
          console.error('Error fetching devices:', error);
          setDevices([]);
        } finally {
          setLoading(false);
        }
      };

      fetchDevices();
      // Refresh device status every 10 seconds
      const interval = setInterval(fetchDevices, 10000);
      return () => clearInterval(interval);
    }, []);

    // Get current devices for pagination
    const indexOfLastDevice = currentPage * devicesPerPage;
    const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
    const currentDevices = devices.slice(indexOfFirstDevice, indexOfLastDevice);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <>
        <ul className="divide-y divide-gray-200">
          {currentDevices.length === 0 ? (
            <li className="py-4 text-center text-gray-500">Không có thiết bị nào</li>
          ) : (
            currentDevices.map((device) => (
              <li key={device._id || device.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${device.status ? 'bg-green-500' : 'bg-red-500'} mr-3`}></div>
                  <span>{device.name}</span>
                </div>
                <span className={device.status ? 'text-green-500' : 'text-red-500'}>
                  {device.status ? 'On' : 'Off'}
                </span>
              </li>
            ))
          )}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l-md border ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-blue-500 hover:bg-blue-50'
                }`}
              >
                &laquo;
              </button>
              
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-3 py-1 border-t border-b ${
                    currentPage === number + 1
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'bg-white text-gray-500 hover:bg-blue-50'
                  }`}
                >
                  {number + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r-md border ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-blue-500 hover:bg-blue-50'
                }`}
              >
                &raquo;
              </button>
            </nav>
          </div>
        )}
      </>
    );
  };

  export default DeviceStatusList;