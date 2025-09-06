const features = [
  {
    title: 'Smart Categorization',
    body: 'Automatic grouping (OTT, Gaming, Productivity) saves setup time and reveals spending patterns instantly.'
  },
  {
    title: 'Renewal Alerts',
    body: 'Get proactive email reminders before charges hit so you can cancel or downgrade in time.'
  },
  {
    title: 'Annualized Cost View',
    body: 'See true yearly impact of monthly and custom billing cycles with one click.'
  },
  {
    title: 'Spending Insights',
    body: 'Identify overlapping tools and unusual spikes to reduce waste.'
  },
  {
    title: 'Role-Based Access',
    body: 'Admin capabilities for oversight while protecting user-owned data integrity.'
  },
  {
    title: 'Secure & Verified',
    body: 'Email verification, JWT auth, token blacklist, and hardened validation layers.'
  }
];

const FeatureGrid = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_65%)]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Why teams choose SubTrack</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">Purpose-built to eliminate subscription sprawl and restore financial clarity.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f,i) => {
            const accentClasses = [
              'from-indigo-500 to-fuchsia-500',
              'from-rose-500 to-orange-400',
              'from-emerald-500 to-teal-400',
              'from-sky-500 to-indigo-500',
              'from-violet-500 to-purple-400',
              'from-amber-500 to-pink-500'
            ];
            const gradient = accentClasses[i % accentClasses.length];
            return (
              <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/70">
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" style={{background:'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.20), transparent 60%)'}} />
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow ring-1 ring-white/20 dark:ring-black/20`}>
                  <span className="text-xs font-semibold">{i+1}</span>
                </div>
                <h3 className="relative mb-2 text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="relative text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.body}</p>
                <div className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-r ${gradient} mix-blend-overlay`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
