import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/rooms', label: 'Rooms', icon: '🛏️' },
  { to: '/reservations', label: 'Reservations', icon: '📅' },
  { to: '/reservations/new', label: 'New Reservation', icon: '➕' },
  { to: '/check-in', label: 'Check-In', icon: '✅' },
  { to: '/check-out', label: 'Check-Out', icon: '🚪' },
  { to: '/guests', label: 'Guests', icon: '👤' },
  { to: '/reports', label: 'Reports', icon: '📈', adminOnly: true },
  { to: '/staff', label: 'Staff Management', icon: '👥', adminOnly: true },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
      <nav className="space-y-1 p-4">
        {links
          .filter((l) => !l.adminOnly || isAdmin)
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-hotel-50 text-hotel-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
