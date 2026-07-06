import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import RoomModal from '../components/RoomModal';
import { roomsApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

const statusBadge = (status) => {
  const colors = {
    AVAILABLE: 'bg-emerald-100 text-emerald-800',
    OCCUPIED: 'bg-red-100 text-red-800',
    MAINTENANCE: 'bg-amber-100 text-amber-800',
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status] || ''}`}>
      {status}
    </span>
  );
};

export default function Rooms() {
  const { isAdmin } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const { data } = await roomsApi.getAll();
      setRooms(data);
    } catch {
      toast.error('Failed to load rooms');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (form) => {
    try {
      if (editing) {
        await roomsApi.update(editing.room_id, form);
        toast.success('Room updated');
      } else {
        await roomsApi.create(form);
        toast.success('Room created');
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    }
  };

  const handleDelete = async (room) => {
    if (!window.confirm(`Delete room ${room.room_number}?`)) return;
    try {
      await roomsApi.remove(room.room_id);
      toast.success('Room deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  const columns = [
    { key: 'room_number', label: 'Room #' },
    { key: 'type', label: 'Type' },
    { key: 'price_per_night', label: 'Price/Night', render: (r) => `$${Number(r.price_per_night).toFixed(2)}` },
    { key: 'floor', label: 'Floor' },
    { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
  ];

  if (isAdmin) {
    columns.push({
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(r);
              setModalOpen(true);
            }}
            className="text-hotel-600 hover:underline"
          >
            Edit
          </button>
          <button type="button" onClick={() => handleDelete(r)} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      ),
    });
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Rooms</h1>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="btn-primary"
          >
            + Add Room
          </button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={rooms}
        searchKeys={['room_number', 'type', 'status']}
        searchPlaceholder="Search rooms..."
      />
      <RoomModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        room={editing}
      />
    </Layout>
  );
}
