import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DEVICE_POWER_WATT = { led: 0.8, fan: 0.66 };
const DEVICE_LABELS = { led: 'Đèn LED', fan: 'Quạt' };

const UsagePage = () => {
  const [TemperatureData, setTemperatureData] = useState([]);
  const [HumidityData, setHumidityData] = useState([]);
  const [LedBrightnessData, setLedBrightnessData] = useState([]);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [deviceStats, setDeviceStats] = useState([]);
  const [latestEnergy, setLatestEnergy] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Sensor data
        const [tempRes, humRes, brightRes] = await Promise.all([
          axios.get('https://io.adafruit.com/api/v2/An_Loi/feeds/bbc-temp/data'),
          axios.get('https://io.adafruit.com/api/v2/An_Loi/feeds/bbc-humidity/data'),
          axios.get('https://io.adafruit.com/api/v2/An_Loi/feeds/bbc-ir/data')
        ]);
        setTemperatureData(tempRes.data.map(d => ({ temp_value: d.value, date: new Date(d.created_at).toLocaleDateString() })));
        setHumidityData(humRes.data.map(d => ({ humidity_value: d.value, date: new Date(d.created_at).toLocaleDateString() })));
        setLedBrightnessData(brightRes.data.map(d => ({ led_brightness_value: d.value, date: new Date(d.created_at).toLocaleDateString(), time: new Date(d.created_at).toLocaleTimeString() })));

        // Device on/off usage for LED and Fan
        const endpoints = ['led', 'fan'];
        const responses = await Promise.all(endpoints.map(dev => axios.get(`${import.meta.env.VITE_APP_API_URL}/api/${dev}`)));
        const usageByDeviceDate = {};
        endpoints.forEach((dev, idx) => {
          const raw = responses[idx].data.map(item => ({ timestamp: new Date(item.created_at?.$date || item.created_at), state: parseFloat(item.value) !== 0 ? 1 : 0 })).sort((a, b) => a.timestamp - b.timestamp);
          let lastState = 0, lastOn = null;
          usageByDeviceDate[dev] = {};
          raw.forEach(({ timestamp, state }) => {
            const dateKey = timestamp.toISOString().slice(0, 10);
            if (!usageByDeviceDate[dev][dateKey]) usageByDeviceDate[dev][dateKey] = 0;
            if (state === 1 && lastState !== 1) lastOn = timestamp;
            if (state === 0 && lastState === 1 && lastOn) { usageByDeviceDate[dev][dateKey] += (timestamp - lastOn) / 1000; lastOn = null; }
            lastState = state;
          });
        });

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const monthStartKey = `${year}-${String(month + 1).padStart(2, '0')}-01`;

        const daysCount = new Date(year, month + 1, 0).getDate();
        const daysInMonth = Array.from({ length: daysCount }, (_, i) => new Date(year, month, i + 1).toISOString().slice(0, 10));
        const filled = daysInMonth.map(date => ({ date, energyWh: Math.round(endpoints.reduce((sum, dev) => sum + ((usageByDeviceDate[dev][date] || 0) * DEVICE_POWER_WATT[dev]), 0) / 3600) }));
        setDailyUsage(filled);

        const stats = endpoints.map(dev => {
          const totalSecs = Object.entries(usageByDeviceDate[dev]).reduce((sum, [date, secs]) => date >= monthStartKey ? sum + secs : sum, 0);
          const hours = +(totalSecs / 3600).toFixed(3);
          const energyKWh = +((totalSecs * DEVICE_POWER_WATT[dev] / 3600) / 1000).toFixed(3);
          const cost = Math.round(energyKWh * 3000);
          return { device: dev, label: DEVICE_LABELS[dev], activeHours: hours, energyKWh, cost };
        });
        setDeviceStats(stats);
        setMonthlyUsage(+stats.reduce((sum, s) => sum + s.energyKWh, 0).toFixed(3));

        const todayKey = today.toISOString().slice(0, 10);
        const todayEntry = filled.find(e => e.date === todayKey);
        setLatestEnergy(todayEntry ? todayEntry.energyWh : 0);

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally { setLoading(false); }
    }
    fetchData();
  }, []);
  //console.log(TemperatureData)
  const estimatedCost = loading
    ? null
    : Math.round(parseFloat(monthlyUsage) * 3000); // đơn vị: đồng
  return (
    <div className="p-6">
      {/* <div className="mb-6">

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
      </div> */}

      {/* Usage Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Temperature Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">Nhiệt độ</h3>
          <div className="h-80 rounded-lg p-4">
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
                    stroke="#ff7c58"
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
          <h3 className="font-semibold mb-4">Độ ẩm</h3>
          <div className="h-80 rounded-lg p-4">
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
          <h3 className="font-semibold mb-4">Độ sáng</h3>
          <div className="h-80 bg-white-100 rounded-lg p-4">
            {LedBrightnessData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={LedBrightnessData.slice(0, 50).reverse()}
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
                    stroke="#6e58ff"
                    activeDot={{ r: 8 }}
                  />
                  <Tooltip formatter={(value, name, props) => {
                    if (name === "Độ sáng") {
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Lượng tiêu thụ điện năng (Trong 30 ngày)</h3>
              <div className=" rounded-lg" style={{ width: '100%', height: 320 }}>
                {!loading && dailyUsage.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyUsage} margin={{ top: 10, right: 60, left: 40, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" Wh" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="energyWh" name="Energy (Wh)" stroke="#82ca9d" activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 flex justify-center items-center h-full">
                    {loading ? 'Loading...' : 'No data'}
                  </p>
                )}
              </div>
            </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Total Energy Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-2">Tổng năng lượng tháng này</h4>
          {loading ? (
            <p className="text-gray-500">Đang tính toán…</p>
          ) : (
            <>
              <p className="text-3xl font-bold text-blue-600">
                {monthlyUsage} kWh
              </p>
            </>
          )}
        </div>

        {/* Peak Usage Card
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-2">Giờ cao điểm</h4>
          <p className="text-3xl font-bold text-orange-500">18:00 - 20:00</p>
          <p className="text-sm text-gray-500">Trung bình 4.2 kWh/giờ</p>
        </div> */}

        {/* Estimated Cost Card */}
        {/* Estimated Cost Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-2">Chi phí ước tính</h4>

          {loading ? (
            <p className="text-gray-500">Đang tính toán…</p>
          ) : (
            <>
              <p className="text-3xl font-bold text-green-600">
                {estimatedCost.toLocaleString('vi-VN')} đ
              </p>
              <p className="text-sm text-gray-500">
                Dựa trên giá 3.000 đ/kWh
              </p>
            </>
          )}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thiết bị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian (giờ)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năng lượng (kWh)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí (đồng)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deviceStats.map(stat => (
                <tr key={stat.device}>
                  <td className="px-6 py-4 whitespace-nowrap">{stat.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stat.activeHours}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stat.energyKWh}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stat.cost.toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;