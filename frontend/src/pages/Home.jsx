import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';
import { Button } from '../components/ui/button';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeatureGrid />
  <section className="relative flex py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-fuchsia-200/40 to-emerald-200/40 dark:via-fuchsia-500/10 dark:to-emerald-500/10" />
        <div className="pointer-events-none absolute inset-0 -z-10 mix-blend-multiply opacity-40 dark:opacity-30 gradient-animated" />
  <div className="container mx-auto max-w-4xl text-center flex flex-col items-center justify-center">
          <h2 className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-4xl">Ready to audit your spend?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">Create a free account and start tracking subscriptions in under 60 seconds. Turn unmanaged renewals into deliberate decisions.</p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-500" onClick={() => window.location.href='/register'}>Get started</Button>
            <Button variant="outline" size="lg" className="font-medium border-gray-300/70 bg-white/70 backdrop-blur hover:bg-white dark:border-gray-700 dark:bg-gray-800/70 dark:hover:bg-gray-800" onClick={() => window.location.href='/login'}>Sign in</Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
