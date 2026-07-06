import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { reportsApi } from '../api/api';

const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    reportsApi
      .getSummary()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load reports'));
  }, []);

  if (!data) {
    return (
      <Layout>
        <p className="text-slate-500">Loading reports...</p>
      </Layout>
    );
  }

  const chartData = [...(data.revenue_by_month || [])].reverse().map((r) => ({
    month: r.month,
    revenue: Number(r.revenue),
  }));

  const occupancyPie = (data.room_status_breakdown || []).map((s) => ({
    name: s.status,
    value: s.count,
  }));

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Reports</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard title="Occupancy Rate" value={`${data.occupancy_rate}%`} icon="📊" />
        <StatCard
          title="Monthly Revenue"
          value={`$${Number(data.monthly_revenue || 0).toLocaleString()}`}
          icon="💵"
          color="green"
        />
        <StatCard title="Total Rooms" value={data.total_rooms} icon="🛏️" color="purple" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Room Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={occupancyPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {occupancyPie.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
