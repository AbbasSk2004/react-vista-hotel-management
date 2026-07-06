import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { guestsApi, roomsApi, reservationsApi } from '../api/api';
import { calculateTotal } from '../utils/helpers';

export default function NewReservation() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    guest_id: '',
    room_id: '',
    check_in_date: '',
    check_out_date: '',
  });
  const [errors, setErrors] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    Promise.all([guestsApi.getAll(), roomsApi.getAll({ status: 'AVAILABLE' })])
      .then(([g, r]) => {
        setGuests(g.data);
        setRooms(r.data);
      })
      .catch(() => toast.error('Failed to load form data'));
  }, []);

  useEffect(() => {
    // room_id here is the MongoDB _id string coming from the select option value
    const room = rooms.find((r) => String(r._id) === String(form.room_id));
    if (room && form.check_in_date && form.check_out_date) {
      setTotal(calculateTotal(room.price_per_night, form.check_in_date, form.check_out_date));
    } else {
      setTotal(0);
    }
  }, [form, rooms]);

  const validate = () => {
    const e = {};
    if (!form.guest_id) e.guest_id = 'Select a guest';
    if (!form.room_id) e.room_id = 'Select a room';
    if (!form.check_in_date) e.check_in_date = 'Required';
    if (!form.check_out_date) e.check_out_date = 'Required';
    if (form.check_in_date && form.check_out_date && form.check_out_date <= form.check_in_date) {
      e.check_out_date = 'Check-out must be after check-in';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      // Send MongoDB ObjectId strings directly — do NOT convert to Number
      await reservationsApi.create({
        guest_id: form.guest_id,
        room_id: form.room_id,
        check_in_date: form.check_in_date,
        check_out_date: form.check_out_date,
        status: 'CONFIRMED',
      });
      toast.success('Reservation created');
      navigate('/reservations');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create reservation');
    }
  };

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">New Reservation</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Guest" error={errors.guest_id}>
          <select
            value={form.guest_id}
            onChange={(e) => setForm({ ...form, guest_id: e.target.value })}
            className="input"
          >
            <option value="">Select guest</option>
            {guests.map((g) => (
              // Use _id as the option value (MongoDB ObjectId string)
              <option key={g._id} value={g._id}>
                {g.full_name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Room" error={errors.room_id}>
          <select
            value={form.room_id}
            onChange={(e) => setForm({ ...form, room_id: e.target.value })}
            className="input"
          >
            <option value="">Select room</option>
            {rooms.map((r) => (
              // Use _id as the option value (MongoDB ObjectId string)
              <option key={r._id} value={r._id}>
                {r.room_number} — {r.type} (${r.price_per_night}/night)
              </option>
            ))}
          </select>
        </Field>
        <Field label="Check-in Date" error={errors.check_in_date}>
          <input
            type="date"
            value={form.check_in_date}
            onChange={(e) => setForm({ ...form, check_in_date: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Check-out Date" error={errors.check_out_date}>
          <input
            type="date"
            value={form.check_out_date}
            onChange={(e) => setForm({ ...form, check_out_date: e.target.value })}
            className="input"
          />
        </Field>
        <div className="rounded-lg bg-hotel-50 p-4">
          <p className="text-sm text-slate-600">Estimated Total</p>
          <p className="text-2xl font-bold text-hotel-700">${total.toFixed(2)}</p>
        </div>
        <button type="submit" className="btn-primary">
          Create Reservation
        </button>
      </form>
    </Layout>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
