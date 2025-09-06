import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUser, updateUser, deleteUser } from '../services/adminApi';

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', isVerified: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // guard
  useEffect(() => { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const u = await getUser(id);
      setData(u);
      setForm({ name: u.name || '', phone: u.phone || '', isVerified: !!u.isVerified });
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load user');
    } finally { setLoading(false); }
  };
  useEffect(() => { if (user?.role==='admin') load(); }, [id, user]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type==='checkbox' ? checked : value }));
  };
  const submit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUser(id, form);
      await load();
    } catch (e2) {
      alert(e2.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };
  const remove = async () => {
    if (!window.confirm('Delete this user?')) return;
    try { setDeleting(true); await deleteUser(id); navigate('/admindashboard'); } catch (e2) { alert(e2.response?.data?.message || 'Delete failed'); } finally { setDeleting(false); }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-300 dark:to-white">User Details</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Admin view & edit</p>
        </div>
        <button onClick={()=> navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Back</button>
      </div>
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading user…</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {data && !loading && (
        <div className="space-y-10">
          <section className="rounded-2xl border border-gray-200/80 bg-white/70 p-6 backdrop-blur shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 text-xl font-semibold text-gray-700 ring-2 ring-white/80 dark:from-gray-700 dark:to-gray-800 dark:text-gray-200 dark:ring-gray-700/70">{(data.name||data.email).charAt(0).toUpperCase()}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{data.name || '—'}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{data.email}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium">
                  <span className={`rounded-full px-2 py-0.5 ${data.isVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'}`}>{data.isVerified ? 'Verified' : 'Pending'}</span>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 uppercase tracking-wide text-gray-700 dark:bg-gray-700 dark:text-gray-300">{data.role}</span>
                </div>
              </div>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <Field label="Name">
                <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100" />
              </Field>
              <Field label="Phone">
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100" />
              </Field>
              <div className="flex items-center gap-2">
                <input id="isVerified" name="isVerified" type="checkbox" checked={form.isVerified} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800" />
                <label htmlFor="isVerified" className="text-sm text-gray-700 dark:text-gray-300">Verified</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" disabled={saving} onClick={load} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Reset</button>
                <button disabled={saving} type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">{saving? 'Saving…':'Save'}</button>
              </div>
            </form>
          </section>
          <section className="rounded-2xl border border-red-200/70 bg-red-50/60 p-6 backdrop-blur dark:border-red-800/50 dark:bg-red-900/20">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Deleting this user is irreversible.</p>
            <button disabled={deleting} onClick={remove} className="rounded-lg border border-red-300 bg-red-500/90 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-600 disabled:opacity-50 dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-800">{deleting? 'Deleting…':'Delete User'}</button>
          </section>
          <section className="text-[11px] text-gray-500 dark:text-gray-400">
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">ID:</strong> {data._id}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Role:</strong> {data.role}</p>
            <p><strong className="font-medium text-gray-700 dark:text-gray-300">Verified:</strong> {data.isVerified ? 'Yes' : 'No'}</p>
          </section>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">{label}</label>
    {children}
  </div>
);

export default AdminUserDetails;
