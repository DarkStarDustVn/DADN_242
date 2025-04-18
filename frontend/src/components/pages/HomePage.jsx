import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DEVICE_POWER_WATT = {
  led: 0.8,
  fan: 0.66,
  ir: 0.02,
  pir: 0.05,
};

const HomePage = () => {
  const [dailyUsage, setDailyUsage] = useState([]);
  const [latestTemp, setLatestTemp] = useState(null);
  const [latestHumidity, setLatestHumidity] = useState(null);
  const [latestIr, setLatestIr] = useState(null);
  const [latestEnergy, setLatestEnergy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      // Fetch device usage
      const endpoints = ['led', 'fan', 'ir', 'pir'];
      const responses = await Promise.all(
        endpoints.map(e => axios.get(`http://localhost:8000/api/${e}`))
      );
      const usageByDate = {};
      responses.forEach((res, i) => {
        const dev = endpoints[i];
        const power = DEVICE_POWER_WATT[dev];
        const raw = res.data.map(item => ({
          timestamp: new Date(item.created_at?.$date || item.created_at),
          value: parseFloat(item.value) !== 0 ? 1 : 0,
        })).sort((a, b) => a.timestamp - b.timestamp);
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
      // Fetch latest temp
      const tempRes = await axios.get('http://localhost:8000/api/temp');
      if (Array.isArray(tempRes.data) && tempRes.data.length) {
        const sorted = tempRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestTemp(sorted[0].value);
      }
      // Fetch latest humidity
      const humRes = await axios.get('http://localhost:8000/api/humidity');
      if (Array.isArray(humRes.data) && humRes.data.length) {
        const sorted = humRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestHumidity(sorted[0].value);
      }
      // Fetch latest ir
      const irRes = await axios.get('http://localhost:8000/api/ir');
      if (Array.isArray(irRes.data) && irRes.data.length) {
        const sorted = irRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestIr(sorted[0].value);
      }
      // Build 30-day array
      const today = new Date();
      const last30 = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().slice(0, 10);
      });
      const filled = last30.map(date => ({
        date,
        energyWh: Math.round((usageByDate[date] || 0) / 3600), // Wh
      }));
      setDailyUsage(filled);
      // set latestEnergy for today
      const todayKey = today.toISOString().slice(0, 10);
      const todayEntry = filled.find(e => e.date === todayKey);
      setLatestEnergy(todayEntry ? todayEntry.energyWh : 0);
    } catch (err) {
      console.error(err);
      setDailyUsage([]);
    } finally { setLoading(false); }
  }


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
              <p className="text-2xl font-semibold">{latestTemp ? `${latestTemp}°C` : '--'}</p>
              {/* <p className="text-green-500 text-sm">+2% from yesterday</p> */}
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
              <p className="text-2xl font-semibold">{latestHumidity ? `${latestHumidity}%` : '--'}</p>
              {/* <p className="text-red-500 text-sm">-5% from yesterday</p> */}
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
              <p className="text-2xl font-semibold">{latestIr ? `${latestIr}%` : '--'}</p>
            </div>
          </div>
        </div>
      </div>



      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Energy Consumption Last 30 Days</h3>
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
    </div >
  );
};

export default HomePage;