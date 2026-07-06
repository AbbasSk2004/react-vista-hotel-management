import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { reservationsApi } from '../api/api';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const load = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      const { data } = await reservationsApi.getAll(params);
      setReservations(data);
    } catch {
      toast.error('Failed to load reservations');
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter, dateFilter]);

  const columns = [
    { key: 'reservation_id', label: 'ID' },
    { key: 'guest_name', label: 'Guest' },
    { key: 'room_number', label: 'Room' },
    { key: 'check_in_date', label: 'Check-in', render: (r) => String(r.check_in_date).slice(0, 10) },
    { key: 'check_out_date', label: 'Check-out', render: (r) => String(r.check_out_date).slice(0, 10) },
    { key: 'status', label: 'Status' },
    { key: 'total_price', label: 'Total', render: (r) => `$${Number(r.total_price).toFixed(2)}` },
  ];

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Reservations</h1>
        <Link to="/reservations/new" className="btn-primary">
          + New Reservation
        </Link>
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <DataTable
        columns={columns}
        data={reservations}
        searchKeys={['guest_name', 'room_number', 'status']}
        searchPlaceholder="Search by guest name..."
      />
    </Layout>
  );
}
