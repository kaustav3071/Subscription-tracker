import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Support() {
  useDocumentTitle('Support');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  // If an admin navigates here directly, redirect to admin inbox
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/support', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return setError('Please type a message');
    setError('');
    setStatus('sending');
    try {
      await api.post('/users/support', { message });
      setStatus('success');
      setMessage('');
    } catch (e) {
      setStatus('error');
      setError(e.response?.data?.message || e.message || 'Failed to send');
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Please log in to contact support.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Support</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Send a message to our admin. Your name & email are auto-filled.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gray-200/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/60">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Name</label>
          <input value={user.name || ''} readOnly className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</label>
          <input value={user.email || ''} readOnly className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Message</label>
          <textarea value={message} onChange={e=> setMessage(e.target.value)} rows={6} placeholder="How can we help?" className="mt-1 w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm text-gray-700 shadow-sm backdrop-blur focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200"></textarea>
          {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={status==='sending'} className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
            {status==='sending' ? 'Sending…' : 'Submit'}
          </button>
          {status==='success' && <span className="text-sm text-emerald-600 dark:text-emerald-400">Sent! We’ll reply soon.</span>}
          {status==='error' && !error && <span className="text-sm text-red-600 dark:text-red-400">Failed to send</span>}
        </div>
      </form>
    </div>
  );
}
