import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import subscriptionApi from '../services/subscriptionApi';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subs, setSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);

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
