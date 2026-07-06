import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { guestsApi } from '../api/api';

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    id_document: '',
    nationality: '',
  });
  const [errors, setErrors] = useState({});

  const load = async () => {
    try {
      const { data } = await guestsApi.getAll();
      setGuests(data);
    } catch {
      toast.error('Failed to load guests');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await guestsApi.create(form);
      toast.success('Guest created');
      setShowForm(false);
      setForm({ full_name: '', email: '', phone: '', id_document: '', nationality: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create guest');
    }
  };

  const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'id_document', label: 'ID Document' },
    { key: 'nationality', label: 'Nationality' },
  ];

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Guest Profiles</h1>
        <button type="button" onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Guest'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          <Input label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} error={errors.full_name} />
          <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Input label="ID Document" value={form.id_document} onChange={(v) => setForm({ ...form, id_document: v })} />
          <Input label="Nationality" value={form.nationality} onChange={(v) => setForm({ ...form, nationality: v })} />
          <div className="flex items-end sm:col-span-2">
            <button type="submit" className="btn-primary">
              Save Guest
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={guests} searchKeys={['full_name', 'email', 'phone']} />
    </Layout>
  );
}

function Input({ label, value, onChange, error }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input" />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
