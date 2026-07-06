import { useState, useEffect } from 'react';

const empty = {
  room_number: '',
  type: 'SINGLE',
  price_per_night: '',
  status: 'AVAILABLE',
  floor: '',
};

export default function RoomModal({ open, onClose, onSave, room }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (room) {
      setForm({
        room_number: room.room_number,
        type: room.type,
        price_per_night: String(room.price_per_night),
        status: room.status,
        floor: String(room.floor),
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [room, open]);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!form.room_number.trim()) e.room_number = 'Required';
    if (!form.price_per_night || Number(form.price_per_night) <= 0) e.price_per_night = 'Invalid price';
    if (!form.floor || Number(form.floor) < 1) e.floor = 'Invalid floor';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      price_per_night: Number(form.price_per_night),
      floor: Number(form.floor),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-800">{room ? 'Edit Room' : 'Add Room'}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label="Room Number" error={errors.room_number}>
            <input
              value={form.room_number}
              onChange={(e) => setForm({ ...form, room_number: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="SUITE">Suite</option>
            </select>
          </Field>
          <Field label="Price / Night" error={errors.price_per_night}>
            <input
              type="number"
              min="1"
              value={form.price_per_night}
              onChange={(e) => setForm({ ...form, price_per_night: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </Field>
          <Field label="Floor" error={errors.floor}>
            <input
              type="number"
              min="1"
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              className="input"
            />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
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
