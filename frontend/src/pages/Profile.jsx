import { useEffect, useMemo, useState } from 'react';
import api, { getNotificationPreferences, updateNotificationPreferences } from '../services/api';
import subscriptionApi from '../services/subscriptionApi';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subs, setSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);
  
  // Notification preferences state
  const [notifPrefs, setNotifPrefs] = useState({
    renewalReminders: true,
    spendingAlerts: true,
    reminderDaysBefore: 3,
    spendingThreshold: 5000,
    currency: 'INR'
  });
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/me');
        if (active) setProfile(data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load profile');
      } finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, []);

  useEffect(()=> {
    let alive = true;
    setSubsLoading(true);
    subscriptionApi.list()
      .then(d => { if (alive) setSubs(d||[]); })
      .catch(()=> {})
      .finally(()=> { if (alive) setSubsLoading(false); });
    return ()=> { alive=false; };
  }, []);

  // Load notification preferences
  useEffect(() => {
    let alive = true;
    setNotifLoading(true);
    getNotificationPreferences()
      .then(prefs => {
        if (alive && prefs) {
          setNotifPrefs(prev => ({ ...prev, ...prefs }));
        }
      })
      .catch(() => {})
      .finally(() => { if (alive) setNotifLoading(false); });
    return () => { alive = false; };
  }, []);

  const handleNotifChange = (field, value) => {
    setNotifPrefs(prev => ({ ...prev, [field]: value }));
    setNotifSuccess(false);
  };

  const saveNotifPrefs = async () => {
    setNotifSaving(true);
    setNotifSuccess(false);
    try {
      await updateNotificationPreferences(notifPrefs);
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save notification preferences:', e);
    } finally {
      setNotifSaving(false);
    }
  };

  const stats = useMemo(()=> {
    const total = subs.length;
    const active = subs.filter(s=> s.status==='active').length;
    const annualINR = subs.reduce((a,b)=> a + (b.annualCostINR ?? b.annualCost ?? 0),0);
    return { total, active, annualINR };
  }, [subs]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-gray-200/70 bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-pink-600 p-[1px] shadow-lg dark:border-gray-800/70">
        <div className="grid gap-6 rounded-[calc(theme(borderRadius.3xl)-1px)] bg-white/80 p-8 backdrop-blur dark:bg-gray-900/70 md:grid-cols-[auto,1fr]">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 p-[2px] shadow ring-1 ring-white/40 dark:ring-gray-800">
              <div className="flex h-full w-full items-center justify-center rounded-[calc(theme(borderRadius.2xl)-2px)] bg-white/80 text-4xl font-bold tracking-tight text-gray-700 dark:bg-gray-900/70 dark:text-gray-100">
                {(profile?.name || profile?.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{profile?.name || '—'}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.email || 'Loading email...'}</p>
              <div className="mt-2 inline-flex rounded-full bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-700 ring-1 ring-inset ring-white/70 backdrop-blur dark:bg-gray-800/70 dark:text-gray-300 dark:ring-gray-700">{profile?.role || 'user'}</div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniStat label="Subscriptions" value={subsLoading ? '…' : stats.total} note="Total" accent="from-indigo-500/20 to-indigo-500/5" />
            <MiniStat label="Active" value={subsLoading ? '…' : stats.active} note="Billing" accent="from-emerald-500/20 to-emerald-500/5" />
            <MiniStat label="Annual Spend" value={subsLoading ? '…' : `₹${stats.annualINR.toFixed(2)}`} note="Approx INR" accent="from-pink-500/20 to-pink-500/5" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)] mix-blend-overlay" />
      </div>

      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile…</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!loading && profile && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Section title="Account Details">
              <dl className="grid gap-5 sm:grid-cols-2">
                <Item label="Name" value={profile.name || '—'} />
                <Item label="Email" value={profile.email} />
                <Item label="Phone" value={profile.phone || '—'} />
                <Item label="Verified" value={profile.isVerified ? 'Yes' : 'No'} badge={profile.isVerified ? 'success' : 'warning'} />
                <Item label="Role" value={profile.role} />
                <Item label="Created" value={new Date(profile.createdAt).toLocaleDateString()} />
              </dl>
            </Section>

            {/* Notification Settings Section */}
            {user.role !== 'admin' && (
            <Section title="Notification Settings">
              {notifLoading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading preferences…</p>
              ) : (
                <div className="space-y-6">
                  {/* Renewal Reminders Toggle */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200/60 bg-gradient-to-r from-indigo-50/50 to-white p-4 dark:border-gray-700/60 dark:from-indigo-900/20 dark:to-gray-800/40">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Renewal Reminders</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get notified before your subscriptions renew</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotifChange('renewalReminders', !notifPrefs.renewalReminders)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${notifPrefs.renewalReminders ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifPrefs.renewalReminders ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Days Before Input */}
                  {notifPrefs.renewalReminders && (
                    <div className="ml-4 rounded-lg border border-gray-200/60 bg-white/60 p-4 dark:border-gray-700/60 dark:bg-gray-800/40">
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Remind me this many days before
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={notifPrefs.reminderDaysBefore}
                          onChange={(e) => handleNotifChange('reminderDaysBefore', Math.max(1, Math.min(30, parseInt(e.target.value) || 3)))}
                          className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
                      </div>
                    </div>
                  )}

                  {/* Spending Alerts Toggle */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200/60 bg-gradient-to-r from-pink-50/50 to-white p-4 dark:border-gray-700/60 dark:from-pink-900/20 dark:to-gray-800/40">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Spending Alerts</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get alerted when spending exceeds your budget</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotifChange('spendingAlerts', !notifPrefs.spendingAlerts)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2 ${notifPrefs.spendingAlerts ? 'bg-pink-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifPrefs.spendingAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Spending Threshold Input */}
                  {notifPrefs.spendingAlerts && (
                    <div className="ml-4 rounded-lg border border-gray-200/60 bg-white/60 p-4 dark:border-gray-700/60 dark:bg-gray-800/40">
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Alert me when total spending exceeds
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <select
                          value={notifPrefs.currency}
                          onChange={(e) => handleNotifChange('currency', e.target.value)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                          <option value="INR">₹ INR</option>
                          <option value="USD">$ USD</option>
                          <option value="EUR">€ EUR</option>
                          <option value="GBP">£ GBP</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={notifPrefs.spendingThreshold}
                          onChange={(e) => handleNotifChange('spendingThreshold', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">per month</span>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={saveNotifPrefs}
                      disabled={notifSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-fuchsia-500 hover:shadow-xl disabled:opacity-50"
                    >
                      {notifSaving ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving…
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Preferences
                        </>
                      )}
                    </button>
                    {notifSuccess && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Saved successfully!
                      </span>
                    )}
                  </div>
      </div>
    )}
  </Section>
  )}
</div>
          <div className="space-y-8">
            <Section title="Quick Insights">
              <ul className="space-y-3 text-sm">
                <Insight label="Active Ratio" value={stats.total ? Math.round(stats.active / stats.total * 100)+'%' : '0%'} />
                <Insight label="Avg Annual / Sub" value={stats.total ? `₹${(stats.annualINR / stats.total).toFixed(2)}` : '₹0.00'} />
                <Insight label="Verified" value={profile.isVerified ? 'Yes' : 'No'} highlight={profile.isVerified} />
              </ul>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 p-6 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/60">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-pink-500/10 opacity-0 transition group-hover:opacity-100" />
    <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</h2>
    {children}
  </div>
);

const Item = ({ label, value, badge }) => (
  <div className="flex flex-col gap-1 rounded-lg border border-gray-200/60 bg-white/60 p-4 text-sm shadow-sm dark:border-gray-800/60 dark:bg-gray-800/40">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
      {value}
      {badge && (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge==='success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : badge==='warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>{badge}</span>
      )}
    </span>
  </div>
);

const MiniStat = ({ label, value, note, accent }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-4 backdrop-blur shadow-sm ring-1 ring-black/5 dark:border-gray-700/60 dark:bg-gray-900/50 dark:ring-white/10">
    <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`} />
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums">{value}</p>
    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">{note}</p>
  </div>
);

const Chip = ({ children, color='gray' }) => {
  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
    gray: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${colorMap[color]}`}>{children}</span>;
};

const Insight = ({ label, value, highlight }) => (
  <li className="flex items-center justify-between rounded-md border border-gray-200/60 bg-white/60 px-3 py-2 dark:border-gray-800/60 dark:bg-gray-800/40">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</span>
    <span className={`text-sm font-medium ${highlight ? 'text-emerald-600 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200'}`}>{value}</span>
  </li>
);

export default Profile;
