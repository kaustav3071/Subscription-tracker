import { useEffect } from 'react';
import { Tag, Sparkles, Bug, Wrench } from 'lucide-react';

const releases = [
  {
    version: 'v1.2.0',
    date: 'December 28, 2025',
    changes: [
      { type: 'feature', text: 'Added spending alerts with customizable thresholds' },
      { type: 'feature', text: 'New calendar view for renewal dates' },
      { type: 'improvement', text: 'Improved auto-categorization accuracy' },
      { type: 'fix', text: 'Fixed email verification link on mobile devices' },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'December 15, 2025',
    changes: [
      { type: 'feature', text: 'Support ticket system for users' },
      { type: 'feature', text: 'Admin dashboard with user management' },
      { type: 'improvement', text: 'Enhanced dark mode styling' },
      { type: 'fix', text: 'Fixed subscription amount rounding issues' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'December 1, 2025',
    changes: [
      { type: 'feature', text: 'Initial release of SubTrack' },
      { type: 'feature', text: 'User registration and authentication' },
      { type: 'feature', text: 'Subscription tracking with categories' },
      { type: 'feature', text: 'Email verification system' },
      { type: 'feature', text: 'Basic spending analytics' },
    ],
  },
];

const typeIcons = {
  feature: { icon: Sparkles, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  improvement: { icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  fix: { icon: Bug, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
};

export default function Changelog() {
  useEffect(() => {
    document.title = 'Changelog | SubTrack';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Changelog
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Stay up to date with the latest features, improvements, and fixes.
        </p>
      </section>

      {/* Releases */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="space-y-12">
          {releases.map((release) => (
            <div key={release.version} className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  <Tag className="h-3.5 w-3.5" />
                  {release.version}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {release.date}
                </span>
              </div>
              <ul className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                {release.changes.map((change, idx) => {
                  const { icon: Icon, color, bg } = typeIcons[change.type];
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`mt-0.5 rounded-md p-1.5 ${bg}`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {change.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
