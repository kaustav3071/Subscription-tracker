import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listUsers, deleteUser } from '../services/adminApi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | verified | pending
  const [sortKey, setSortKey] = useState('name'); // name | email | verified
  const [sortDir, setSortDir] = useState('asc'); // asc | desc
  // drawer removed – navigation pattern used

  // Combined filtering + sorting
  const processedUsers = useMemo(() => {
    let list = [...users];
    // query filter
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(u => [u.name, u.email, u.phone, u.role].filter(Boolean).some(v => v.toLowerCase().includes(q)));
    }
    // status filter
    if (statusFilter === 'verified') list = list.filter(u => u.isVerified);
    else if (statusFilter === 'pending') list = list.filter(u => !u.isVerified);
    // sorting
    list.sort((a,b) => {
      let av, bv;
      switch (sortKey) {
        case 'email': av=a.email||''; bv=b.email||''; break;
        case 'verified': av = a.isVerified?1:0; bv = b.isVerified?1:0; break;
        case 'name':
        default: av = (a.name||'').toLowerCase(); bv = (b.name||'').toLowerCase(); break;
      }
      if (av < bv) return sortDir==='asc' ? -1 : 1;
      if (av > bv) return sortDir==='asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [users, query, statusFilter, sortKey, sortDir]);

  // role guard
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true); setError(null);
      const data = await listUsers();
      setUsers(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load users');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (user?.role === 'admin') loadUsers(); }, [user]);

  const openDetails = (id) => navigate(`/admin/users/${id}`);
  const confirmDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      setDeleting(id);
      await deleteUser(id);
      await loadUsers();
    } catch (e2) {
      alert(e2.response?.data?.message || 'Delete failed');
    } finally { setDeleting(null); }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-300 dark:via-fuchsia-300 dark:to-pink-300">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage users and platform insights.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <input
              value={query}
              onChange={e=> setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-60 rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">⌕</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-gray-100/70 px-1 py-1 text-xs dark:bg-gray-800/60">
            {['all','verified','pending'].map(f => (
              <button
                key={f}
                onClick={()=> setStatusFilter(f)}
                className={`px-3 py-1 rounded-full font-medium transition ${statusFilter===f ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >{f==='all' ? 'All' : f==='verified' ? 'Verified' : 'Pending'}</button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Sort</label>
            <select
              value={sortKey}
              onChange={e=> setSortKey(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="verified">Verified</option>
            </select>
            <button
              onClick={()=> setSortDir(d => d==='asc' ? 'desc' : 'asc')}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >{sortDir==='asc' ? '↑' : '↓'}</button>
          </div>
          <button onClick={loadUsers} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">Refresh</button>
        </div>
      </div>
      <section className="mb-10 grid gap-6 md:grid-cols-4">
        <StatCard label="Users" icon="👥" value={loading ? '…' : users.length} note="Total registered" accent="from-indigo-500/20 to-indigo-500/5" />
        <StatCard label="Verified" icon="✅" value={loading ? '…' : users.filter(u=>u.isVerified).length} note="Email confirmed" accent="from-emerald-500/20 to-emerald-500/5" />
        <StatCard label="Pending" icon="⏳" value={loading ? '…' : users.filter(u=>!u.isVerified).length} note="Awaiting verify" accent="from-amber-500/20 to-amber-500/5" />
        <StatCard label="Role: Admins" icon="🛡️" value={loading ? '…' : users.filter(u=>u.role==='admin').length} note="Privileged" accent="from-pink-500/20 to-pink-500/5" />
      </section>

      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 p-6 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/50">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 opacity-0 transition group-hover:opacity-100" />
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Verification Rate</h3>
            <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {loading ? '…' : users.length ? Math.round(users.filter(u=>u.isVerified).length / users.length * 100) + '%' : '0%'}
            </p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Percentage of users that have verified their account.</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              {!loading && (
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-all" style={{width: users.length ? (users.filter(u=>u.isVerified).length / users.length * 100)+'%' : '0%'}} />
              )}
            </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 p-6 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/50">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-transparent to-indigo-500/10 opacity-0 transition group-hover:opacity-100" />
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Growth Trend</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">(Placeholder) Coming soon: user signup trend over time.</p>
          <div className="h-40 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/80 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
            Sparkline / chart area
          </div>
        </div>
      </section>
      <div className="group rounded-2xl border border-gray-200/80 bg-white/70 shadow-xl shadow-gray-200/40 ring-1 ring-white/50 backdrop-blur transition dark:border-gray-800/70 dark:bg-gray-900/60 dark:shadow-black/40 dark:ring-gray-900/60">
        <div className="relative flex items-center justify-between border-b border-gray-200/70 px-6 py-4 dark:border-gray-800/70">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-pink-500/10 opacity-0 transition group-hover:opacity-100" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Users</h2>
          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{loading ? 'Loading' : `${users.length} total`}</span>
        </div>
        <div className="overflow-x-auto">
          {error && <p className="px-5 pt-4 text-sm text-destructive">{error}</p>}
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-gray-50 via-white to-gray-50 text-gray-600 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:text-gray-300">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Verified</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800/70">
              {loading ? (
                [...Array(6)].map((_,i) => (
                  <tr key={i} className="animate-fade-in">
                    <td className="px-5 py-3"><div className="h-5 w-36 rounded-md skeleton" /></td>
                    <td className="px-5 py-3"><div className="h-5 w-52 rounded-md skeleton" /></td>
                    <td className="px-5 py-3"><div className="h-5 w-28 rounded-md skeleton" /></td>
                    <td className="px-5 py-3"><div className="h-5 w-20 rounded-md skeleton" /></td>
                    <td className="px-5 py-3"><div className="h-5 w-16 rounded-md skeleton" /></td>
                    <td className="px-5 py-3"><div className="ml-auto h-5 w-24 rounded-md skeleton" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-6 text-center text-gray-500 dark:text-gray-400">No users found</td></tr>
              ) : processedUsers.map(u => (
                <tr
                  key={u._id}
                  onClick={(e)=> {
                    const tag = e.target.tagName.toLowerCase();
                    if (['button','svg','path'].includes(tag)) return;
                    openDetails(u._id);
                  }}
                  className="group cursor-pointer transition hover:bg-gradient-to-r hover:from-indigo-50 hover:via-pink-50 hover:to-amber-50 dark:hover:from-indigo-900/20 dark:hover:via-fuchsia-900/20 dark:hover:to-amber-900/10"
                >
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-[11px] font-semibold text-gray-700 shadow-sm ring-1 ring-white/70 dark:from-gray-700 dark:to-gray-800 dark:text-gray-200 dark:ring-gray-700/80">{(u.name||u.email).charAt(0).toUpperCase()}</span>
                      <span>{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{u.email}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{u.phone || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'}`}>
                      {u.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-300">
                    <span className="inline-flex rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-700 dark:bg-gray-700 dark:text-gray-300">{u.role}</span>
                  </td>
                  <td className="px-5 py-3 space-x-2 text-right">
                    <button onClick={()=> openDetails(u._id)} className="rounded-md border border-indigo-300 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-600/60 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50">View</button>
                    <button disabled={deleting===u._id} onClick={()=> confirmDelete(u._id)} className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50">{deleting===u._id? 'Deleting…':'Delete'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// (Old useFiltered removed; logic replaced by combined processedUsers memo)


const StatCard = ({ label, value, note, icon, accent="from-indigo-500/20 to-indigo-500/5" }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 p-5 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/50">
    <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`} />
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</h2>
      {icon && <span className="text-lg" aria-hidden>{icon}</span>}
    </div>
    <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{note}</p>
  </div>
);

const Th = ({ children }) => (
  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">{children}</th>
);

export default AdminDashboard;
