import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { staffApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  full_name: '',
  email: '',
  password: '',
  role: 'RECEPTIONIST',
};

function roleBadge(role) {
  if (role === 'ADMIN') {
    return (
      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">ADMIN</span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
      RECEPTIONIST
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function FormField({ label, error, children, hint }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function StaffManagement() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [addForm, setAddForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState({ ...emptyForm, password: '' });
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await staffApi.getAll();
      setStaff(data);
    } catch {
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validateAdd = () => {
    const e = {};
    if (!addForm.full_name.trim()) e.full_name = 'Full name is required';
    if (!addForm.email.trim()) e.email = 'Email is required';
    if (!addForm.password) e.password = 'Password is required';
    else if (addForm.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!addForm.role) e.role = 'Role is required';
    setAddErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateEdit = () => {
    const e = {};
    if (!editForm.full_name.trim()) e.full_name = 'Full name is required';
    if (!editForm.email.trim()) e.email = 'Email is required';
    if (editForm.password && editForm.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateAdd()) return;
    setSubmitting(true);
    try {
      await staffApi.create({
        full_name: addForm.full_name.trim(),
        email: addForm.email.trim(),
        password: addForm.password,
        role: addForm.role,
      });
      toast.success('Staff member created');
      setAddOpen(false);
      setAddForm(emptyForm);
      setAddErrors({});
      load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create staff';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) {
        setAddErrors((prev) => ({ ...prev, email: msg }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (member) => {
    setEditing(member);
    setEditForm({
      full_name: member.full_name,
      email: member.email,
      password: '',
      role: member.role,
    });
    setEditErrors({});
    setEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateEdit() || !editing) return;
    setSubmitting(true);
    try {
      const payload = {
        full_name: editForm.full_name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
      };
      if (editForm.password) payload.password = editForm.password;
      await staffApi.update(editing.staff_id, payload);
      toast.success('Staff member updated');
      setEditOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update staff';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) {
        setEditErrors((prev) => ({ ...prev, email: msg }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member) => {
    try {
      await staffApi.remove(member.staff_id);
      toast.success('Staff member deleted');
      setConfirmDeleteId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  const isSelf = (member) => String(member.staff_id) === String(user?.staff_id);

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage admin and receptionist accounts</p>
        </div>
        <button type="button" onClick={() => setAddOpen(true)} className="btn-primary">
          + Add Staff Member
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-hotel-500 border-t-transparent" />
          </div>
        ) : staff.length === 0 ? (
          <p className="py-16 text-center text-slate-500">No staff members found</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Full Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Created At</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((member) => (
                <Fragment key={member.staff_id}>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{member.full_name}</td>
                    <td className="px-4 py-3 text-slate-600">{member.email}</td>
                    <td className="px-4 py-3">{roleBadge(member.role)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(member.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(member)}
                          className="rounded-lg p-2 text-hotel-600 hover:bg-hotel-50"
                          title="Edit"
                          aria-label="Edit staff member"
                        >
                          <PencilIcon />
                        </button>
                        <span title={isSelf(member) ? 'Cannot delete your own account' : 'Delete'}>
                          <button
                            type="button"
                            disabled={isSelf(member)}
                            onClick={() => setConfirmDeleteId(member.staff_id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Delete staff member"
                          >
                            <TrashIcon />
                          </button>
                        </span>
                      </div>
                    </td>
                  </tr>
                  {confirmDeleteId === member.staff_id && (
                    <tr key={`confirm-${member.staff_id}`} className="bg-red-50">
                      <td colSpan={5} className="px-4 py-4">
                        <p className="text-sm text-slate-700">
                          Are you sure you want to delete <strong>{member.full_name}</strong>? This
                          action cannot be undone.
                        </p>
                        <div className="mt-3 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(member)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Yes, Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Staff Member">
        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <FormField label="Full Name" error={addErrors.full_name}>
            <input
              value={addForm.full_name}
              onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
              className="input"
            />
          </FormField>
          <FormField label="Email" error={addErrors.email}>
            <input
              type="email"
              value={addForm.email}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              className="input"
            />
          </FormField>
          <FormField label="Password" error={addErrors.password}>
            <input
              type="password"
              value={addForm.password}
              onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
              className="input"
            />
          </FormField>
          <FormField label="Role" error={addErrors.role}>
            <select
              value={addForm.role}
              onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
              className="input"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="RECEPTIONIST">RECEPTIONIST</option>
            </select>
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {submitting ? 'Creating...' : 'Create Staff Member'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Staff Member">
        <form onSubmit={handleUpdate} className="mt-4 space-y-4">
          <FormField label="Full Name" error={editErrors.full_name}>
            <input
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              className="input"
            />
          </FormField>
          <FormField label="Email" error={editErrors.email}>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="input"
            />
          </FormField>
          <FormField label="Role">
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="input"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="RECEPTIONIST">RECEPTIONIST</option>
            </select>
          </FormField>
          <FormField
            label="New Password"
            error={editErrors.password}
            hint="Leave blank to keep current password"
          >
            <input
              type="password"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              className="input"
            />
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-4.707 1.414a1 1 0 00-1.414 1.414L4.828 9.172a2 2 0 00-.586 1.414V12h1.414a2 2 0 001.414-.586l4.757-4.757a1 1 0 011.414-1.414z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
        clipRule="evenodd"
      />
    </svg>
  );
}
