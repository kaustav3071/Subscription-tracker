import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listSupport, resolveSupport } from '../services/adminApi';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function AdminSupport(){
  useDocumentTitle('Admin Support');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('open');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(()=> { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);

  useEffect(()=> {
    let mounted = true;
    setLoading(true);
    setError('');
    listSupport({ status: status === 'all' ? undefined : status })
      .then(d => { if (mounted) setTickets(d); })
      .catch(e => { if (mounted) setError(e.response?.data?.message || e.message); })
      .finally(()=> { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [status]);

  const counts = useMemo(()=>{
    const c = { all: tickets.length, open: tickets.filter(t=>t.status==='open').length, resolved: tickets.filter(t=>t.status==='resolved').length };
    return c;
  }, [tickets]);

  const markResolved = async (id) => {
    try {
      const updated = await resolveSupport(id);
      setTickets(prev => prev.map(t => t._id === id ? updated : t));
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Support Inbox</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Messages from users</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-gray-100/70 px-1 py-1 text-xs dark:bg-gray-800/60">
          {['open','resolved','all'].map(s => (
            <button key={s} onClick={()=> setStatus(s)} className={`px-3 py-1 rounded-full font-medium transition ${status===s ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>{s.charAt(0).toUpperCase()+s.slice(1)}{s!=='all' && ` (${counts[s]||0})`}</button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/80 bg-white/70 shadow-lg ring-1 ring-white/50 backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/60">
        <div className="flex items-center justify-between border-b border-gray-200/70 px-6 py-4 dark:border-gray-800/70">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Tickets</h2>
          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{loading ? 'Loading...' : `${tickets.length} items`}</span>
        </div>
        {error && <div className="px-6 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>}
        <div className="divide-y divide-gray-200/70 dark:divide-gray-800/70">
          {loading ? (
            <div className="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">Loading…</div>
          ) : tickets.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">No tickets.</div>
          ) : tickets.map(t => (
            <div key={t._id} className="px-6 py-5 hover:bg-gray-50/80 dark:hover:bg-gray-800/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name || '—'} <span className="text-gray-400">•</span> <span className="text-gray-600 dark:text-gray-300">{t.email}</span></div>
                  <div className="mt-1 max-w-3xl whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{t.message}</div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{new Date(t.createdAt).toLocaleString()} • <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${t.status==='open' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'}`}>{t.status}</span></div>
                </div>
                {t.status==='open' && (
                  <button onClick={()=> markResolved(t._id)} className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">Mark resolved</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
