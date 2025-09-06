import { useAuth } from '../context/AuthContext';

const statCards = [
  { label: 'Active Subscriptions', value: 0, hint: 'Total currently tracked' },
  { label: 'Monthly Spend', value: 0, hint: 'Estimated this month' },
  { label: 'Upcoming Renewals', value: 0, hint: 'Next 30 days' },
  { label: 'Potential Savings', value: 0, hint: 'Based on anomalies' }
];

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back{user?.name ? `, ${user.name}`:''}. Your subscription overview at a glance.</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(c => (
          <div key={c.label} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70">
            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{background:'radial-gradient(circle at 35% 25%, rgba(99,102,241,0.20), transparent 60%)'}} />
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{c.value}</p>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-500">{c.hint}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white/60 p-8 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
        Charts & detailed analytics section placeholder.
      </div>
    </div>
  );
}
