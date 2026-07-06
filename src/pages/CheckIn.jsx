import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { reservationsApi } from '../api/api';

export default function CheckIn() {
  const [reservations, setReservations] = useState([]);

  const load = async () => {
    try {
      const { data } = await reservationsApi.getAll({ status: 'CONFIRMED' });
      const pendingRes = await reservationsApi.getAll({ status: 'PENDING' });
      setReservations([...data, ...pendingRes.data]);
    } catch {
      toast.error('Failed to load reservations');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCheckIn = async (id) => {
    try {
      await reservationsApi.checkIn(id);
      toast.success('Guest checked in');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Check-in failed');
    }
  };

  const columns = [
    { key: 'reservation_id', label: 'ID' },
    { key: 'guest_name', label: 'Guest' },
    { key: 'room_number', label: 'Room' },
    { key: 'check_in_date', label: 'Check-in', render: (r) => String(r.check_in_date).slice(0, 10) },
    { key: 'check_out_date', label: 'Check-out', render: (r) => String(r.check_out_date).slice(0, 10) },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      render: (r) => (
        <button type="button" onClick={() => handleCheckIn(r.reservation_id)} className="btn-primary text-xs">
          Check In
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Check-In</h1>
      <p className="mb-4 text-sm text-slate-600">Select a confirmed reservation to check in the guest.</p>
      <DataTable columns={columns} data={reservations} searchKeys={['guest_name', 'room_number']} />
    </Layout>
  );
}
