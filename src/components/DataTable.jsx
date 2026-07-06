import { useState, useMemo } from 'react';
import { sortData, filterBySearch } from '../utils/helpers';

export default function DataTable({
  columns,
  data,
  searchKeys = [],
  searchPlaceholder = 'Search...',
  actions,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(columns[0]?.key);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    const searched = filterBySearch(data, search, searchKeys.length ? searchKeys : columns.map((c) => c.key));
    return sortData(searched, sortKey, sortDir);
  }, [data, search, sortKey, sortDir, searchKeys, columns]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-hotel-500 focus:outline-none focus:ring-1 focus:ring-hotel-500"
        />
        {actions}
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3 text-left font-semibold text-slate-700 ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-slate-100' : ''
                  }`}
                >
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={String(row._id ?? row.reservation_id ?? row.room_id ?? row.guest_id ?? row.staff_id ?? i)} className="hover:bg-slate-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
