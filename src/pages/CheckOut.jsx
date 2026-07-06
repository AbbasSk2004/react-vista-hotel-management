import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import InvoiceModal from '../components/InvoiceModal';
import { reservationsApi } from '../api/api';

export default function CheckOut() {
  const [reservations, setReservations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [payment, setPayment] = useState({ payment_method: 'CASH', amount_paid: '' });
  const [invoice, setInvoice] = useState(null);

  const load = async () => {
    try {
      const { data } = await reservationsApi.getAll({ status: 'CHECKED_IN' });
      setReservations(data);
    } catch {
      toast.error('Failed to load reservations');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCheckout = (res) => {
    setSelected(res);
    setPayment({ payment_method: 'CASH', amount_paid: String(res.total_price) });
  };

  const handleCheckout = async () => {
    if (!selected) return;
    if (!payment.amount_paid || Number(payment.amount_paid) < 0) {
      toast.error('Enter a valid payment amount');
      return;
    }
    try {
      const { data } = await reservationsApi.checkOut(selected.reservation_id, payment);
      toast.success('Checkout complete');
      setInvoice(data.invoice);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Checkout failed');
    }
  };

  const columns = [
    { key: 'reservation_id', label: 'ID' },
    { key: 'guest_name', label: 'Guest' },
    { key: 'room_number', label: 'Room' },
    { key: 'check_in_date', label: 'Check-in', render: (r) => String(r.check_in_date).slice(0, 10) },
    { key: 'check_out_date', label: 'Check-out', render: (r) => String(r.check_out_date).slice(0, 10) },
    { key: 'total_price', label: 'Total', render: (r) => `$${Number(r.total_price).toFixed(2)}` },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      render: (r) => (
        <button type="button" onClick={() => openCheckout(r)} className="btn-primary text-xs">
          Check Out
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Check-Out & Invoice</h1>
      <DataTable columns={columns} data={reservations} searchKeys={['guest_name']} />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold">Checkout — {selected.guest_name}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Room {selected.room_number} · ${Number(selected.total_price).toFixed(2)} due
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <select
                  value={payment.payment_method}
                  onChange={(e) => setPayment({ ...payment, payment_method: e.target.value })}
                  className="input mt-1"
                >
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount Paid</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={payment.amount_paid}
                  onChange={(e) => setPayment({ ...payment, amount_paid: e.target.value })}
                  className="input mt-1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setSelected(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleCheckout} className="btn-primary">
                Complete Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <InvoiceModal invoice={invoice} onClose={() => setInvoice(null)} />
    </Layout>
  );
}
