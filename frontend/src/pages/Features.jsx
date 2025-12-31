import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  PieChart, 
  Calendar, 
  Shield, 
  Zap, 
  FolderOpen,
  TrendingUp,
  Mail
} from 'lucide-react';

const features = [
  {
    icon: PieChart,
    title: 'Spending Analytics',
    description: 'Get detailed insights into your subscription spending with beautiful charts and breakdowns by category.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a renewal. Get timely notifications before your subscriptions charge.',
  },
  {
    icon: Calendar,
    title: 'Renewal Calendar',
    description: 'See all your upcoming renewals in one place with our intuitive calendar view.',
  },
  {
    icon: FolderOpen,
    title: 'Auto-Categorization',
    description: 'Subscriptions are automatically categorized for easy organization and analysis.',
  },
  {
    icon: TrendingUp,
    title: 'Spending Alerts',
    description: 'Set custom thresholds and get alerted when your spending exceeds your budget.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never share your information with third parties.',
  },
  {
    icon: Zap,
    title: 'Quick Entry',
    description: 'Add subscriptions in seconds with our streamlined interface and smart defaults.',
  },
  {
    icon: Mail,
    title: 'Email Reports',
    description: 'Receive weekly or monthly spending summaries directly in your inbox.',
  },
];

export default function Features() {
  useEffect(() => {
    document.title = 'Features | SubTrack';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Powerful Features
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Everything you need to track, manage, and optimize your subscription spending.
        </p>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ready to take control?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Start tracking your subscriptions for free today.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
