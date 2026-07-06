export default function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className={`w-full rounded-xl bg-white p-6 shadow-xl ${wide ? 'max-w-lg' : 'max-w-md'}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        {children}
      </div>
    </div>
  );
}
