export default function RoomCard({ room, onSelect }) {
  const statusColors = {
    AVAILABLE: 'border-emerald-200 bg-emerald-50',
    OCCUPIED: 'border-red-200 bg-red-50',
    MAINTENANCE: 'border-amber-200 bg-amber-50',
  };

  return (
    <button
      type="button"
      onClick={() => onSelect?.(room)}
      className={`w-full rounded-xl border p-4 text-left shadow-sm transition hover:shadow-md ${
        statusColors[room.status] || 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-800">Room {room.room_number}</span>
        <span className="text-xs font-medium uppercase text-slate-500">{room.status}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{room.type} · Floor {room.floor}</p>
      <p className="mt-2 text-hotel-700 font-semibold">${Number(room.price_per_night).toFixed(2)}/night</p>
    </button>
  );
}
