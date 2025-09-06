import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/me');
        if (active) setProfile(data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load profile');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {(!loading && profile) && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Account</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-300">Name</dt><dd className="font-medium text-gray-900 dark:text-white">{profile.name || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-300">Email</dt><dd className="font-medium text-gray-900 dark:text-white">{profile.email}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-300">Phone</dt><dd className="font-medium text-gray-900 dark:text-white">{profile.phone || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-300">Verified</dt><dd className="font-medium text-gray-900 dark:text-white">{profile.isVerified ? 'Yes' : 'No'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-300">Role</dt><dd className="font-medium text-gray-900 dark:text-white">{profile.role}</dd></div>
            </dl>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Security</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Password changes & 2FA coming soon.</p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"/></svg>
              <span className="text-xs font-medium">Feature roadmap item</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
