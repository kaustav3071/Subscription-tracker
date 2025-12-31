import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listUserSupport, resolveUserSupport, getUserSupportHistory } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function UserSupport(){
  useDocumentTitle('My Support Tickets');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('open');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingHistory, setViewingHistory] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(()=> {
    let mounted = true;
    setLoading(true);
    setError('');
    listUserSupport({ status: status === 'all' ? undefined : status })
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
      const updated = await resolveUserSupport(id);
      setTickets(prev => prev.map(t => t._id === id ? updated : t));
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  const viewHistory = async (id) => {
    setViewingHistory(id);
    setLoadingHistory(true);
    setError('');
    try {
      const data = await getUserSupportHistory(id);
      setHistoryData(data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">My Support Tickets</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track your support requests</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-gray-100/70 px-1 py-1 text-xs dark:bg-gray-800/60">
          {['open','resolved','all'].map(s => (
            <button key={s} onClick={()=> setStatus(s)} className={`px-3 py-1 rounded-full font-medium transition ${status===s ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>{s.charAt(0).toUpperCase()+s.slice(1)}{s!=='all' && ` (${counts[s]||0})`}</button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/80 bg-white/70 shadow-lg ring-1 ring-white/50 backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/60">
        <div className="flex items-center justify-between border-b border-gray-200/70 px-6 py-4 dark:border-gray-800/70">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Your Tickets</h2>
          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{loading ? 'Loading...' : `${tickets.length} items`}</span>
        </div>
        {error && <div className="px-6 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>}
        <div className="divide-y divide-gray-200/70 dark:divide-gray-800/70">
          {loading ? (
            <div className="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">Loading…</div>
          ) : tickets.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">No tickets. <a href="/support" className="text-blue-600 hover:underline">Create one</a></div>
          ) : tickets.map(t => (
            <div key={t._id} className="px-6 py-5 hover:bg-gray-50/80 dark:hover:bg-gray-800/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ticket #{t._id.slice(-6)}</div>
                  <div className="mt-1 max-w-3xl whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{t.message}</div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(t.createdAt).toLocaleString()} • 
                    <span className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${t.status==='open' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'}`}>{t.status}</span>
                    {t.replies && t.replies.length > 0 && (
                      <span className="ml-2 text-blue-600 dark:text-blue-400">• {t.replies.length} {t.replies.length === 1 ? 'reply' : 'replies'}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=> viewHistory(t._id)} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">History</button>
                  {t.status==='open' && (
                    <button onClick={()=> markResolved(t._id)} className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">Mark resolved</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Modal */}
      {viewingHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setViewingHistory(null); setHistoryData(null); }}>
          <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Message History</h3>
              <button onClick={() => { setViewingHistory(null); setHistoryData(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {loadingHistory ? (
                <div className="py-8 text-center text-sm text-gray-500">Loading history...</div>
              ) : historyData ? (
                <div className="space-y-4">
                  {/* Original Message */}
                  <div className="rounded-lg border border-gray-200 bg-blue-50/50 p-4 dark:border-gray-700 dark:bg-blue-900/20">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">YOU</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{new Date(historyData.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{historyData.message}</p>
                  </div>

                  {/* Replies */}
                  {historyData.replies && historyData.replies.length > 0 ? (
                    historyData.replies.map((reply, idx) => (
                      <div key={idx} className={`rounded-lg border p-4 ${reply.sender === 'admin' ? 'border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-900/20' : 'border-gray-200 bg-blue-50/50 dark:border-gray-700 dark:bg-blue-900/20'}`}>
                        <div className="mb-2 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${reply.sender === 'admin' ? 'bg-green-600' : 'bg-blue-600'}`}>{reply.sender === 'admin' ? 'SUPPORT' : 'YOU'}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{new Date(reply.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{reply.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">Waiting for support response...</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
