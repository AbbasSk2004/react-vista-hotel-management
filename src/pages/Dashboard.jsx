import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { reportsApi, roomsApi, reservationsApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadStats();
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      if (isAdmin) {
        const { data } = await reportsApi.getSummary();
        setStats(data);
        setChartData(
          [...(data.revenue_by_month || [])].reverse().map((r) => ({
            month: r.month,
            revenue: Number(r.revenue),
          }))
        );
      } else {
        const [roomsRes, resRes] = await Promise.all([
          roomsApi.getAll(),
          reservationsApi.getAll(),
        ]);
        const rooms = roomsRes.data;
        const today = new Date().toISOString().slice(0, 10);
        const todayCheckIns = resRes.data.filter(
          (r) => r.check_in_date?.slice(0, 10) === today && ['CONFIRMED', 'CHECKED_IN'].includes(r.status)
        );
        setStats({
          total_rooms: rooms.length,
          occupied_rooms: rooms.filter((r) => r.status === 'OCCUPIED').length,
          available_rooms: rooms.filter((r) => r.status === 'AVAILABLE').length,
          today_check_ins: todayCheckIns.length,
          monthly_revenue: 0,
          occupancy_rate: rooms.length
            ? Math.round((rooms.filter((r) => r.status === 'OCCUPIED').length / rooms.length) * 100)
            : 0,
        });
        setChartData([]);
      }
    } catch {
      toast.error('Failed to load dashboard');
    }
  };

  if (!stats) {
    return (
      <Layout>
        <p className="text-slate-500">Loading dashboard...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Rooms" value={stats.total_rooms} icon="🛏️" />
        <StatCard title="Occupied" value={stats.occupied_rooms} icon="🔴" color="amber" />
        <StatCard title="Available" value={stats.available_rooms} icon="🟢" color="green" />
        <StatCard
          title="Today's Check-ins"
          value={stats.today_check_ins}
          icon="📥"
          color="purple"
        />
      </div>
      {isAdmin && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Monthly Revenue"
            value={`$${Number(stats.monthly_revenue || 0).toLocaleString()}`}
            subtitle={`Occupancy: ${stats.occupancy_rate}%`}
            icon="💰"
          />
        </div>
      )}
      {chartData.length > 0 && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Layout>
  );
}
