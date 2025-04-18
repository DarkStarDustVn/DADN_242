import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UsagePage = () => {
  const [TemperatureData, setTemperatureData] = useState([]);
  const [HumidityData, setHumidityData] = useState([]);
  const [LedBrightnessData, setLedBrightnessData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const temperature_data = await axios.get(`https://io.adafruit.com/api/v2/An_Loi/feeds/bbc-temp/data`);
        setTemperatureData(temperature_data.data.map((data) => ({
          temp_value: data.value,
          date: new Date(data.created_at).toLocaleDateString(),
        })));

        const humidity_data = await axios.get(`https://io.adafruit.com/api/v2/An_Loi/feeds/bbc-humidity/data`);
        setHumidityData(humidity_data.data.map((data) => ({
          humidity_value: data.value,
          date: new Date(data.created_at).toLocaleDateString(),
        })));

        const Led_brightness_data = await axios.get(`https://io.adafruit.com/api/v2/An_Loi/feeds/bbc-ir/data`);
        setLedBrightnessData(Led_brightness_data.data.map((data) => ({
          led_brightness_value: data.value,
          date: new Date(data.created_at).toLocaleDateString(),
          time: new Date(data.created_at).toLocaleTimeString(),
        })));


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this effect runs once on component mount
  console.log(TemperatureData)
  return (
    <div className="p-6">
      <div className="mb-6">

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả thiết bị</option>
              <option>Living Room Light</option>
              <option>Kitchen Light</option>
              <option>Air Conditioner</option>
              <option>Smart TV</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>3 tháng qua</option>
              <option>6 tháng qua</option>
              <option>1 năm qua</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Temperature Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-4">Nhiệt độ (7 ngày qua)</h4>
          <div className="h-80 bg-violet-100 rounded-lg p-4">
            {TemperatureData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={TemperatureData.slice(0, 50).reverse()}
                  margin={{ top: 10, right: 60, left: 40, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temp_value"
                    name="Nhiệt độ (°C)"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 flex items-center justify-center h-full">Đang tải dữ liệu nhiệt độ...</p>
            )}
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-4">Độ ẩm</h4>
          <div className="h-80 bg-violet-100 rounded-lg p-4">
            {HumidityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={HumidityData.slice(0, 50).reverse()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="humidity_value"
                    name="Độ ẩm (%)"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 flex items-center justify-center h-full">Đang tải dữ liệu độ ẩm...</p>
            )}
          </div>
        </div>

        {/* LED Brightness Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-4">Độ sáng</h4>
          <div className="h-80 bg-violet-100 rounded-lg p-4">
            {LedBrightnessData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={LedBrightnessData.slice(0, 30).reverse()}
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis dataKey="led_brightness_value" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="led_brightness_value"
                    name="Độ sáng"
                    stroke="#ffc658"
                    activeDot={{ r: 8 }}
                  />
                  <Tooltip formatter={(value, name, props) => {
                    if (name === "Độ sáng ") {
                      return [`${value} (${props.payload.time})`, name];
                    }
                    return [value, name];
                  }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 flex items-center justify-center h-full">Đang tải dữ liệu độ sáng...</p>
            )}
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Energy Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-2">Tổng năng lượng</h4>
          <p className="text-3xl font-bold text-blue-600">245.8 kWh</p>
          <p className="text-sm text-gray-500">+12% so với kỳ trước</p>
        </div>

        {/* Peak Usage Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-2">Giờ cao điểm</h4>
          <p className="text-3xl font-bold text-orange-500">18:00 - 20:00</p>
          <p className="text-sm text-gray-500">Trung bình 4.2 kWh/giờ</p>
        </div>

        {/* Estimated Cost Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-2">Chi phí ước tính</h4>
          <p className="text-3xl font-bold text-green-600">789.000 đ</p>
          <p className="text-sm text-gray-500">Dựa trên giá điện hiện tại</p>
        </div>
      </div>

      {/* Device Usage Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold">Chi tiết sử dụng theo thiết bị</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thiết bị</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian hoạt động</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năng lượng tiêu thụ</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí ước tính</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Air Conditioner</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">120 giờ</td>
                <td className="px-6 py-4 whitespace-nowrap">156.4 kWh</td>
                <td className="px-6 py-4 whitespace-nowrap">468.000 đ</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Living Room Light</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">85 giờ</td>
                <td className="px-6 py-4 whitespace-nowrap">12.8 kWh</td>
                <td className="px-6 py-4 whitespace-nowrap">38.400 đ</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span>Kitchen Light</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">42 giờ</td>
                <td className="px-6 py-4 whitespace-nowrap">6.3 kWh</td>
                <td className="px-6 py-4 whitespace-nowrap">18.900 đ</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span>Smart TV</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">65 giờ</td>
                <td className="px-6 py-4 whitespace-nowrap">70.3 kWh</td>
                <td className="px-6 py-4 whitespace-nowrap">210.900 đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;