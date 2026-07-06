export default function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 no-print">
      <div className="invoice-print w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">
        <div className="border-b border-slate-200 pb-4 text-center">
          <h2 className="text-2xl font-bold text-hotel-800">Grand Vista Hotel</h2>
          <p className="text-sm text-slate-500">Invoice #{invoice.invoice_id}</p>
        </div>
        <div className="mt-6 space-y-2 text-sm">
          <Row label="Guest" value={invoice.guest_name} />
          <Row label="Room" value={`${invoice.room_number} (${invoice.room_type})`} />
          <Row label="Check-in" value={formatDate(invoice.check_in_date)} />
          <Row label="Check-out" value={formatDate(invoice.check_out_date)} />
          <Row label="Issue Date" value={formatDate(invoice.issue_date)} />
          <Row label="Payment" value={invoice.payment_method || '—'} />
          <Row label="Status" value={invoice.status} />
        </div>
        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <div className="flex justify-between text-sm">
            <span>Amount Due</span>
            <span className="font-semibold">${Number(invoice.amount_due).toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between text-lg font-bold text-hotel-700">
            <span>Amount Paid</span>
            <span>${Number(invoice.amount_paid).toFixed(2)}</span>
          </div>
        </div>
        <div className="no-print mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button type="button" onClick={handlePrint} className="btn-primary">
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(d) {
  if (!d) return '—';
  return String(d).slice(0, 10);
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
