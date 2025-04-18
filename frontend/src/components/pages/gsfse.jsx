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
    ResponsiveContainer,
} from 'recharts';

const DEVICE_POWER_WATT = {
    led: 0.8,
    fan: 4.3,
    ir: 0.02,
    pir: 0.05,
};

const HomePage = () => {
    const [dailyUsage, setDailyUsage] = useState([]);
    const [latestTemp, setLatestTemp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(fetchData, 60000);
        fetchData();
        return () => clearInterval(interval);
    }, []);

    async function fetchData() {
        try {
            const endpoints = ['led', 'fan', 'ir', 'pir'];
            const responses = await Promise.all(
                endpoints.map(endpoint => axios.get(`http://localhost:8000/api/${endpoint}`))
            );

            const usageByDate = {};

            responses.forEach((res, index) => {
                const device = endpoints[index];
                const power = DEVICE_POWER_WATT[device];
                const raw = res.data.map(item => ({
                    timestamp: new Date(item.created_at?.$date || item.created_at),
                    value: parseFloat(item.value) !== 0 ? 1 : 0,
                })).sort((a, b) => a.timestamp - b.timestamp);

                let lastState = null;
                let lastOnTime = null;

                raw.forEach(entry => {
                    const dateKey = entry.timestamp.toISOString().slice(0, 10);
                    if (!usageByDate[dateKey]) usageByDate[dateKey] = 0;

                    if (entry.value === 1 && lastState !== 1) lastOnTime = entry.timestamp;

                    if (entry.value === 0 && lastState === 1 && lastOnTime) {
                        const diff = (entry.timestamp - lastOnTime) / 1000;
                        usageByDate[dateKey] += diff * power;
                        lastOnTime = null;
                    }

                    lastState = entry.value;
                });
            });

            const tempResponse = await axios.get('http://localhost:8000/api/temp');
            if (Array.isArray(tempResponse.data) && tempResponse.data.length > 0) {
                const sorted = tempResponse.data.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                setLatestTemp(sorted[0].value);
            }

            const today = new Date();
            const last30Dates = Array.from({ length: 30 }, (_, i) => {
                const d = new Date(today);
                d.setDate(d.getDate() - (29 - i));
                return d.toISOString().slice(0, 10);
            });

            const filled = last30Dates.map(date => ({
                date,
                energy_kwh: (usageByDate[date] / 3600 || 0).toFixed(4),
            }));

            setDailyUsage(filled);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu từ backend:', error);
            setDailyUsage([]);
        } finally {
            setLoading(false);
        }
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
                            <p className="text-green-500 text-sm">Cập nhật mới nhất</p>
                        </div>
                    </div>
                </div>

                {/* Other metric cards here if needed */}
            </div>

            {/* Data Visualization Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Điện năng tiêu thụ 30 ngày gần nhất (Tổng cộng)</h3>
                <div
                    className="bg-violet-100 rounded-lg"
                    style={{ width: '100%', height: 320 }}
                >
                    {!loading && dailyUsage.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={dailyUsage}
                                margin={{ top: 10, right: 60, left: 40, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis unit=" Wh" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="energy_kwh"
                                    name="Tổng điện năng (Wh)"
                                    stroke="#82ca9d"
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 flex items-center justify-center h-full">
                            {loading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu để hiển thị'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
