import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative overflow-hidden gradient-hero-bg">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-40 gradient-animated" />
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl mix-blend-overlay dark:mix-blend-normal" />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32 animate-fade-in">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm dark:from-indigo-400 dark:via-fuchsia-400 dark:to-emerald-400 leading-tight pb-2">
          Take control of your <span className="underline decoration-white/40 dark:decoration-transparent">recurring spend</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 animate-slide-up [animation-delay:.15s]">
          SubTrack centralizes every subscription bill, predicts upcoming charges, and helps you eliminate waste. Smarter insights. Zero surprises.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row animate-slide-up [animation-delay:.3s]">
          {user ? (
            <>
              <Link to="/dashboard" className="glow-ring inline-flex items-center justify-center rounded-full bg-gray-900 px-10 py-3 text-sm font-semibold text-white shadow-sm shadow-gray-900/20 transition hover:-translate-y-0.5 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white">
                Go to Dashboard
              </Link>
              <Link to="/subscriptions" className="inline-flex items-center justify-center rounded-full border border-gray-300/70 bg-white/70 px-10 py-3 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100 dark:hover:bg-gray-800">
                My Subscriptions
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="glow-ring inline-flex items-center justify-center rounded-full bg-gray-900 px-10 py-3 text-sm font-semibold text-white shadow-sm shadow-gray-900/20 transition hover:-translate-y-0.5 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white">
                Get started free
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-gray-300/70 bg-white/70 px-10 py-3 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100 dark:hover:bg-gray-800">
                Sign in
              </Link>
            </>
          )}
        </div>
        <div className="mt-24 grid w-full gap-6 sm:grid-cols-3 animate-slide-up [animation-delay:.45s]">
          {[['Track','See all active subscriptions & real cost'],['Predict','Upcoming renewals & annualized spend'],['Optimize','Spot duplicates & downgrade opportunities']].map(([title,desc]) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white/70 p-6 text-left backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
