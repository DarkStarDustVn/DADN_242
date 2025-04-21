import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import DeviceStatusList from '../../utils/DeviceStatusList.jsx';

const DEVICE_POWER_WATT = {
  led: 0.8,
  fan: 0.66,
};

const HomePage = () => {
  const [dailyUsage, setDailyUsage] = useState([]);
  const [latestTemp, setLatestTemp] = useState(null);
  const [latestHumidity, setLatestHumidity] = useState(null);
  const [latestIr, setLatestIr] = useState(null);
  const [latestEnergy, setLatestEnergy] = useState(null);
  const [loading, setLoading] = useState(true);

  // Threshold settings
  const saved = localStorage.getItem('energyThreshold');
  const [appliedThreshold, setAppliedThreshold] = useState(saved ? parseInt(saved, 10) : '');
  const [inputThreshold, setInputThreshold] = useState(appliedThreshold);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    fetchData();
    return () => clearInterval(interval);
  }, [appliedThreshold]);

  async function fetchData() {
    try {
      // Fetch device usage
      const endpoints = ['led', 'fan'];
      const responses = await Promise.all(
        endpoints.map(e => axios.get(`http://localhost:8000/api/${e}`))
      );
      const usageByDate = {};
      responses.forEach((res, i) => {
        const dev = endpoints[i];
        const power = DEVICE_POWER_WATT[dev];
        const raw = res.data
          .map(item => ({
            timestamp: new Date(item.created_at?.$date || item.created_at),
            value: parseFloat(item.value) !== 0 ? 1 : 0,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        let lastState = null;
        let lastOn = null;
        raw.forEach(({ timestamp, value }) => {
          const key = timestamp.toISOString().slice(0, 10);
          if (!usageByDate[key]) usageByDate[key] = 0;
          if (value === 1 && lastState !== 1) lastOn = timestamp;
          if (value === 0 && lastState === 1 && lastOn) {
            const secs = (timestamp - lastOn) / 1000;
            usageByDate[key] += secs * power;
            lastOn = null;
          }
          lastState = value;
        });
      });

      // Fetch latest sensors
      const [tempRes, humRes, irRes] = await Promise.all([
        axios.get('http://localhost:8000/api/temp'),
        axios.get('http://localhost:8000/api/humidity'),
        axios.get('http://localhost:8000/api/ir')
      ]);

      if (Array.isArray(tempRes.data) && tempRes.data.length) {
        const t = tempRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestTemp(t[0].value);
      }
      if (Array.isArray(humRes.data) && humRes.data.length) {
        const h = humRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestHumidity(h[0].value);
      }
      if (Array.isArray(irRes.data) && irRes.data.length) {
        const i = irRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestIr(i[0].value);
      }

      // Build 30-day data
      const today = new Date();
      const last30 = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (29 - i));
        return d.toISOString().slice(0, 10);
      });
      const filled = last30.map(date => ({
        date,
        energyWh: Math.round((usageByDate[date] || 0) / 3600),
      }));
      setDailyUsage(filled);

      const todayKey = today.toISOString().slice(0, 10);
      const todayEntry = filled.find(e => e.date === todayKey);
      const energy = todayEntry ? todayEntry.energyWh : 0;
      setLatestEnergy(energy);
      if (appliedThreshold !== '' && energy > appliedThreshold) {
        setAlertMessage(`⚠️ Lượng điện hôm nay (${energy} Wh) đã vượt ngưỡng ${appliedThreshold} Wh!`);
      } else {
        setAlertMessage('');
      }
    } catch (err) {
      console.error(err);
      setDailyUsage([]);
    } finally {
      setLoading(false);
    }
  }

  const handleOpen = () => {
    setInputThreshold(appliedThreshold);
    setShowModal(true);
  };

  const saveThreshold = () => {
    setAppliedThreshold(inputThreshold);
    localStorage.setItem('energyThreshold', inputThreshold);
    setShowModal(false);
    // Immediately re-fetch data to update alert without page refresh
    fetchData();
  };

  return (
    <div className="p-6">
      {/* Alert */}
      {alertMessage && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded mb-6">
          {alertMessage}
        </div>
      )}

      {/* Settings Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleOpen}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Cài đặt ngưỡng
        </button>
      </div>

      {/* Settings Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-transform duration-200 scale-95 animate-scaleUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Cài đặt ngưỡng điện</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngưỡng (Wh)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Nhập số Wh"
                value={inputThreshold}
                onChange={e => setInputThreshold(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">Hủy</button>
              <button onClick={saveThreshold} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Temperature Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Nhiệt Độ</p>
              <p className="text-2xl font-semibold">{latestTemp ? `${latestTemp}°C` : '--'}</p>
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Độ Ẩm</p>
              <p className="text-2xl font-semibold">{latestHumidity ? `${latestHumidity}%` : '--'}</p>
            </div>
          </div>
        </div>

        {/* Brightness Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Độ sáng</p>
              <p className="text-2xl font-semibold">{latestIr ? `${latestIr}%` : '--'}</p>
            </div>
          </div>
        </div>

        {/* Energy Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tổng điện (hôm nay)</p>
              <p className="text-2xl font-semibold">{latestEnergy !== null ? `${latestEnergy} Wh` : '--'}</p>
            </div>
          </div>
        </div>
      </div>



      {/* Data Visualization Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative mb-4">
          <h3 className="text-lg font-semibold">Lượng tiêu thụ điện năng (Trong 30 ngày)</h3>
          <div className="absolute top-0 right-0 text-sm">
            <Link to="/usage" className="text-blue-500 hover:text-blue-400">
              Xem chi tiết →
            </Link>
          </div>
        </div>
        <div className="bg-violet-100 rounded-lg" style={{ width: '100%', height: 320 }}>
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

      {/* Device Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Trạng thái các thiết bị hiện tại</h3>
          <DeviceStatusList />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Hoạt Động Gần Đây</h3>
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