import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import subscriptionApi from '../services/subscriptionApi';

const AdminUserSubscriptions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');

  useEffect(()=> { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    subscriptionApi.adminListUser(id)
      .then(data => { if (active){ setSubs(data); setError(null);} })
      .catch(err => { if (active) setError(err.response?.data?.message || err.message); })
      .finally(()=> { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const categories = useMemo(()=> {
    const set = new Set();
    subs.forEach(s => { if (s.category) set.add(s.category); });
    return Array.from(set).sort();
  }, [subs]);

  const filtered = useMemo(()=> {
    let list = [...subs];
    if (query){
      const q = query.toLowerCase();
      list = list.filter(s => [s.name, s.provider, s.category].some(v => v && v.toLowerCase().includes(q)));
    }
    if (status !== 'all') list = list.filter(s => s.status === status);
    if (category !== 'all') list = list.filter(s => s.category === category);
    return list;
  }, [subs, query, status, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">User Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">For user ID {id}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input value={query} onChange={e=> setQuery(e.target.value)} placeholder="Search..." className="w-56 rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100" />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">⌕</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-gray-100/70 px-1 py-1 text-xs dark:bg-gray-800/60">
            {['all','active','paused','canceled'].map(s => (
              <button key={s} onClick={()=> setStatus(s)} className={`px-3 py-1 rounded-full font-medium transition ${status===s ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
          <select value={category} onChange={e=> setCategory(e.target.value)} className="rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-xs shadow-sm backdrop-blur focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={()=> navigate(-1)} className="rounded-lg border border-gray-300 bg-white/60 px-4 py-2 text-xs font-medium hover:bg-white dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-300 dark:hover:bg-gray-800">Back</button>
        </div>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        <Stat label="Total" value={loading ? '...' : subs.length} note="All subs" />
        <Stat label="Annual Spend (INR)" value={loading ? '...' : `₹${subs.reduce((a,b)=> a + (b.annualCostINR ?? (b.annualCost || 0)),0).toFixed(2)}`} note="Approx converted" />
        <Stat label="Active" value={loading ? '...' : subs.filter(s=>s.status==='active').length} note="Billing" />
      </div>

      <div className="rounded-2xl border border-gray-200/80 bg-white/70 shadow-lg ring-1 ring-white/50 backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/60">
        <div className="flex items-center justify-between border-b border-gray-200/70 px-6 py-4 dark:border-gray-800/70">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">List</h2>
          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{loading ? 'Loading...' : `${filtered.length} shown`}</span>
        </div>
        {error && <div className="px-6 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50/70 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
              <tr>
                <Th>Name</Th><Th>Provider</Th><Th>Category</Th><Th>Status</Th><Th>Amount</Th><Th>Next Charge</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800/70">
              {loading && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading subscriptions...</td></tr>
              )}
              {!loading && filtered.map(s => {
                const sid = s.id || s._id;
                return (
                  <tr key={sid} className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/60">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">{s.name}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{s.provider}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{s.category}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.status==='active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : s.status==='paused' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{s.amountINR != null ? `₹${Number(s.amountINR).toFixed(2)}` : (s.amount != null ? `₹${Number(s.amount).toFixed(2)}` : '-')}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{s.nextChargeDate ? new Date(s.nextChargeDate).toLocaleDateString() : '-'}</td>
                  </tr>
                );
              })}
              {!loading && !error && filtered.length===0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No subscriptions match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, note }) => (
  <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">{label}</h2>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{note}</p>
  </div>
);
const Th = ({children}) => <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">{children}</th>;

export default AdminUserSubscriptions;
