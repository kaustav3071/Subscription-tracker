import { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Ensure chart components are registered exactly once to avoid canvas reuse errors
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle);
import { useAuth } from '../context/AuthContext';
import subscriptionApi from '../services/subscriptionApi';

export default function Dashboard() {
  const { user } = useAuth();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=> {
    let active = true;
    setLoading(true); setError(null);
    subscriptionApi.list()
      .then(data => { if (!active) return; setSubs(data || []); })
      .catch(e => { if (active) setError(e.response?.data?.message || e.message); })
      .finally(()=> { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => {
    const total = subs.length;
    const active = subs.filter(s=> s.status==='active').length;
    const annualSpendINR = subs.reduce((a,b)=> a + (b.annualCostINR ?? b.annualCost ?? 0), 0);
    const monthlySpendINR = annualSpendINR / 12;
    const upcomingRenewals = subs.filter(s => {
      if (!s.nextChargeDate) return false;
      const d = new Date(s.nextChargeDate);
      const now = new Date();
      const in30 = new Date(); in30.setDate(in30.getDate()+30);
      return d >= now && d <= in30;
    }).length;
    return { total, active, annualSpendINR, monthlySpendINR, upcomingRenewals };
  }, [subs]);

  const categoryBreakdown = useMemo(()=> {
    const map = {};
    subs.forEach(s => { const c = s.category || 'other'; map[c] = (map[c]||0)+1; });
    return Object.entries(map).sort((a,b)=> b[1]-a[1]).slice(0,6);
  }, [subs]);

  const categoryChartData = useMemo(()=> {
    if (!categoryBreakdown.length) return null;
    const palette = ['#6366F1','#8B5CF6','#EC4899','#F59E0B','#10B981','#0EA5E9'];
    return {
      labels: categoryBreakdown.map(([c]) => c),
      datasets: [{
        data: categoryBreakdown.map(([,n]) => n),
        backgroundColor: categoryBreakdown.map((_,i)=> palette[i % palette.length]),
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
        hoverOffset: 6,
      }]
    };
  }, [categoryBreakdown]);

  const topSpend = useMemo(()=> {
    return [...subs]
      .sort((a,b)=> (b.amountINR ?? b.amount ?? 0) - (a.amountINR ?? a.amount ?? 0))
      .slice(0,5);
  }, [subs]);

  const topSpendChartData = useMemo(()=> {
    if (!topSpend.length) return null;
    return {
      labels: topSpend.map(s => s.name),
      datasets: [{
        label: 'Amount (INR)',
        data: topSpend.map(s => Number(s.amountINR ?? s.amount ?? 0)),
        backgroundColor: 'rgba(99,102,241,0.6)',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(99,102,241,1)'
      }]
    };
  }, [topSpend]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back{user?.name ? `, ${user.name}`:''}. Personalized subscription insights.</p>
        </div>
        <div>
          {loading && <span className="text-xs text-gray-400 dark:text-gray-500">Loading data…</span>}
          {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
        </div>
      </div>

      <section className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Subs" icon="📦" accent="from-indigo-500/20 to-indigo-500/5" value={loading ? '…' : stats.total} note="All tracked" />
        <Stat label="Active" icon="⚡" accent="from-emerald-500/20 to-emerald-500/5" value={loading ? '…' : stats.active} note="Currently billing" />
        <Stat label="Annual Spend" icon="💰" accent="from-pink-500/20 to-pink-500/5" value={loading ? '…' : `₹${stats.annualSpendINR.toFixed(2)}`} note="INR approx" />
        <Stat label="Monthly Spend" icon="📅" accent="from-amber-500/20 to-amber-500/5" value={loading ? '…' : `₹${stats.monthlySpendINR.toFixed(2)}`} note="Avg per month" />
      </section>

      <section className="mb-12 grid gap-6 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 p-6 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/60 lg:col-span-2">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-pink-500/10 opacity-0 transition group-hover:opacity-100" />
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Top Spend</h2>
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
          ) : !topSpendChartData ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No data yet.</p>
          ) : (
            <Bar
              data={topSpendChartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => `₹${v}` } } }
              }}
              height={140}
            />
          )}
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 p-6 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/60">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-transparent to-indigo-500/10 opacity-0 transition group-hover:opacity-100" />
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Categories</h2>
          {loading ? <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p> : !categoryChartData ? <p className="text-sm text-gray-500 dark:text-gray-400">No data yet.</p> : (
            <Doughnut
              data={categoryChartData}
              options={{
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 14, color: '#6b7280' } },
                  tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw}` } }
                },
                cutout: '55%',
              }}
            />
          )}
          <div className="mt-6 rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 p-[1px]">
            <div className="rounded-md bg-white/70 p-3 text-[11px] text-gray-600 backdrop-blur dark:bg-gray-900/60 dark:text-gray-400">
              Tip: Add more subscriptions to refine insights.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <InfoCard title="Upcoming Renewals" accent="from-amber-500/20 to-amber-500/5" value={loading ? '…' : stats.upcomingRenewals} note="In next 30 days" icon="⏰" />
        <InfoCard title="Avg / Subscription" accent="from-sky-500/20 to-sky-500/5" value={loading ? '…' : (stats.total ? `₹${(stats.annualSpendINR / stats.total).toFixed(2)}` : '₹0.00')} note="Annual avg INR" icon="📊" />
        <InfoCard title="Data Freshness" accent="from-violet-500/20 to-violet-500/5" value={loading ? '…' : 'Now'} note="Live pull" icon="🔄" />
      </section>
    </div>
  );
}

const Stat = ({ label, value, note, icon, accent }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 p-5 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/60">
    <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`} />
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</h2>
      {icon && <span className="text-lg" aria-hidden>{icon}</span>}
    </div>
    <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums">{value}</p>
    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{note}</p>
  </div>
);

const InfoCard = ({ title, value, note, icon, accent }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 p-5 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/60">
    <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`} />
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</h3>
      {icon && <span className="text-base">{icon}</span>}
    </div>
    <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums">{value}</p>
    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{note}</p>
  </div>
);

const Th = ({ children }) => <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">{children}</th>;
