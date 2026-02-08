import { useState, useEffect } from 'react';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Navbar from '../components/Navbar';
import api from '../api/axiosapi';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function ReconciliationDashboard() {
  const [chartData, setChartData] = useState([]);

  const [results, setResults] = useState();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/dashboard/stats");
        console.log(res.data);
        
        setResults(res.data);
        
        // Update chart data based on API response
        setChartData([
          { name: 'Matched', value: res.data.matched },
          { name: 'Unmatched', value: res.data.unmatched },
          { name: 'Duplicates', value: res.data.duplicate },
        ]);
      } catch (err) {
        console.error('Error fetching stats:', err);
        alert('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Records</h3>
          <p className="text-3xl font-bold mt-2">{results.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Matched</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{results.matched}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Unmatched</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{results.unmatched}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Duplicates</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">{results.duplicate}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{results.accuracy}%</p>
        </div>
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Match Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}