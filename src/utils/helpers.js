export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function calculateTotal(pricePerNight, checkIn, checkOut) {
  const nights = nightsBetween(checkIn, checkOut);
  return nights > 0 ? Number(pricePerNight) * nights : 0;
}

export function sortData(data, key, direction) {
  return [...data].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return direction === 'asc' ? av - bv : bv - av;
    }
    const cmp = String(av).localeCompare(String(bv));
    return direction === 'asc' ? cmp : -cmp;
  });
}

export function filterBySearch(rows, search, keys) {
  if (!search.trim()) return rows;
  const q = search.toLowerCase();
  return rows.filter((row) =>
    keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))
  );
}
