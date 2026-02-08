"use client";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface AnalyticsChartsProps {
    data: {
        traffic: any[];
        device: any[];
        browser: any[];
        os: any[];
    };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const AnalyticsCharts = ({ data }: AnalyticsChartsProps) => {
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Traffic Chart */}
            <div className="glass-card p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Visitor Traffic Trend</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.traffic}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCount)" name="Total Visits" />
                            <Area type="monotone" dataKey="unique" stroke="#10B981" fillOpacity={1} fill="transparent" strokeDasharray="5 5" name="Unique Visitors" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Device Distribution */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Device Distribution</h3>
                <div className="h-[250px] w-full flex justify-center">
                    {data.device && data.device.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.device}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.device.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center text-gray-400">No data available</div>
                    )}
                </div>
            </div>

            {/* Browser Distribution */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Top Browsers</h3>
                <div className="h-[250px] w-full">
                    {data.browser && data.browser.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.browser} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} className="text-xs" />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                    {data.browser.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center text-gray-400">No data available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
